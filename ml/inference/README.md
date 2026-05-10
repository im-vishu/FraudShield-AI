# ML Inference API (stub)

This is a Phase 1 stub to establish the ML service contract.

Run:

```bash
cd ml
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn inference.server:app --reload --port 7001
```

Endpoints:

- `GET /health`
- `POST /score`

The Node backend will call this service in later phases.

