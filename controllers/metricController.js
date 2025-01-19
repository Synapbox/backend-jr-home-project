const metricService = require("../services/metricService");

async function calculateTop2Boxes(req, res) {
  try {
    const { body: data } = req;
    if (!Array.isArray(data)) {
      return res.status(400).json({ error: "Invalid input format. Expected an array of objects." });
    }

    const response = metricService.calculateTop2Boxes(data);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { calculateTop2Boxes };
