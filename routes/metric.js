const express = require("express");
const { calculateTop2Boxes } = require("../controllers/metricController");
const { verifyToken } = require("../middlewares/verifyAuth");

const router = express.Router();

router.post("/top-2-boxes", verifyToken, calculateTop2Boxes);

module.exports = router;