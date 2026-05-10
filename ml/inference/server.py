from __future__ import annotations

import hashlib
from typing import Any, Dict, List, Optional

from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(
    title="FraudShield AI ML Inference",
    version="0.1.0",
    description="Phase 1 stub. Returns deterministic demo scores + explanations.",
)


class TxnPayload(BaseModel):
    amount: float = Field(..., ge=0)
    currency: str = "INR"
    ipAddress: Optional[str] = None
    deviceId: Optional[str] = None
    location: Optional[str] = None
    senderAccount: Optional[str] = None
    receiverAccount: Optional[str] = None
    timestampIso: Optional[str] = None


class ScoreResponse(BaseModel):
    riskScore: int = Field(..., ge=0, le=100)
    riskLevel: str
    decision: str
    explanation: str
    signals: Dict[str, Any]


def _stable_int(s: str) -> int:
    h = hashlib.sha256(s.encode("utf-8")).hexdigest()
    return int(h[:8], 16)


def _band(score: int) -> str:
    if score >= 85:
        return "CRITICAL"
    if score >= 70:
        return "HIGH"
    if score >= 40:
        return "MEDIUM"
    return "LOW"


@app.get("/health")
def health() -> Dict[str, Any]:
    return {"ok": True}


@app.post("/score", response_model=ScoreResponse)
def score(payload: TxnPayload) -> ScoreResponse:
    # Phase 1 deterministic scorer:
    # base score from a stable hash + amount contribution.
    seed = f"{payload.ipAddress}|{payload.deviceId}|{payload.location}|{payload.senderAccount}|{payload.receiverAccount}"
    base = _stable_int(seed or "default") % 60  # 0..59
    amt = min(int(payload.amount // 2000), 40)  # amount adds up to 40 points
    score = max(0, min(100, base + amt))

    level = _band(score)
    decision = "ALLOW" if score < 70 else "REVIEW"

    signals: Dict[str, Any] = {
        "amount_bucket": int(payload.amount // 1000),
        "hash_base": base,
        "amount_contrib": amt,
        "ip_present": bool(payload.ipAddress),
        "device_present": bool(payload.deviceId),
    }

    explanation = (
        f"Risk score derived from amount bucket and a stable identity hash. "
        f"Amount contributed {amt} points."
    )

    return ScoreResponse(
        riskScore=score,
        riskLevel=level,
        decision=decision,
        explanation=explanation,
        signals=signals,
    )

