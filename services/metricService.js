const calculationUtils = require("../utils/calculationUtils");

function calculateTop2Boxes(data) {
  const sampleSize = data.length;
  const histogram = calculationUtils.calculateHistogram(data);

  const score = histogram.reduce((sum, item) => sum + item.frequencyPercentage, 0);

  return {
    calculation: "top2boxes",
    sampleSize,
    totalParticipants: sampleSize,
    score: parseFloat(score.toFixed(4)),
    histogram,
  };
}

module.exports = { calculateTop2Boxes };
