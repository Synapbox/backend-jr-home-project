function calculateHistogram(data) {
    const frequencyMap = {};
  
    data.forEach(({ optionId, label }) => {
      const key = `${optionId}_${label}`;
      if (!frequencyMap[key]) {
        frequencyMap[key] = { optionId, label, frequencyCount: 0 };
      }
      frequencyMap[key].frequencyCount += 1;
    });
  
    const sampleSize = data.length;
    const sortedOptions = Object.values(frequencyMap).sort((a, b) => b.frequencyCount - a.frequencyCount);
  
    return sortedOptions.slice(0, 2).map((item, index) => ({
      optionId: item.optionId,
      label: item.label,
      order: index + 1,
      frequencyCount: item.frequencyCount,
      frequencyPercentage: parseFloat((item.frequencyCount / sampleSize).toFixed(4)),
      sampleSize,
    }));
  }
  
  module.exports = { calculateHistogram };
  