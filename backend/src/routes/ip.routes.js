const express = require("express");
const { checkIP } = require("../controllers/ip.controller");
const { authenticate } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authenticate);

router.post("/check", checkIP);

module.exports = router;