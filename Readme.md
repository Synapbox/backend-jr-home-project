# Project Overview
This project is a backend API that calculates statistical metrics based on survey or questionnaire data. It allows clients to send data and retrieve statistical insights related to top-box calculations, such as frequency counts and percentages of specific options.

## 1. API Endpoints
POST /calculation/metric/top-2-boxes

This endpoint receives an array of survey data, processes it, and calculates the top two boxes (the most frequently selected options). The calculation is based on a histogram of the frequency of responses for each option.

Request Body (JSON):

'''
[
  { "optionId": 1, "label": "Option A" },
  { "optionId": 2, "label": "Option B" },
  { "optionId": 1, "label": "Option A" },
  { "optionId": 3, "label": "Option C" }
]
'''

Response (JSON):

'''
{
  "calculation": "top2boxes",
  "sampleSize": 4,
  "totalParticipants": 4,
  "score": 1.0000,
  "histogram": [
    {
      "optionId": 1,
      "label": "Option A",
      "order": 1,
      "frequencyCount": 2,
      "frequencyPercentage": 0.5000,
      "sampleSize": 4
    },
    {
      "optionId": 2,
      "label": "Option B",
      "order": 2,
      "frequencyCount": 1,
      "frequencyPercentage": 0.2500,
      "sampleSize": 4
    }
  ]
}
''' 

## 2. Business Logic and Statistical Calculation Explanation
### Key Concepts:
Histogram Calculation: The calculateHistogram function calculates the frequency of each unique combination of optionId and label in the dataset. It generates a frequency map, sorts the options based on their frequency count, and then calculates the percentage of each option's frequency relative to the total sample size.

### Top 2 Boxes Calculation: The calculateTop2Boxes function calculates the "Top 2 Boxes" score, which represents the total frequency percentage of the top two most frequent options.

### Detailed Explanation of Functions:
calculateHistogram(data):

- Purpose: To count the occurrences of each option (combination of optionId and label).
- Input: An array of survey data objects, where each object has optionId and label.
- Output: A sorted list of the top two options with their respective counts and percentages.

## Steps:

### Frequency Map:
- The function iterates over each entry in the data array and creates a unique key for each optionId and label combination.
- It uses this key to store the frequency count (frequencyCount) of each combination in a frequencyMap object.
### Sorting:
- After counting, the frequency map is sorted by frequencyCount in descending order.
### Top 2 Boxes:
- The function then selects the top two most frequent options and calculates their percentage relative to the total sample size.
- The output includes the optionId, label, order (ranking), frequencyCount, frequencyPercentage, and the sampleSize.

## Example output for a data sample:

'''
[
  {
    "optionId": 1,
    "label": "Option A",
    "order": 1,
    "frequencyCount": 2,
    "frequencyPercentage": 0.5000,
    "sampleSize": 4
  },
  {
    "optionId": 2,
    "label": "Option B",
    "order": 2,
    "frequencyCount": 1,
    "frequencyPercentage": 0.2500,
    "sampleSize": 4
  }
]

'''

### calculateTop2Boxes(data):

- Purpose: To calculate the "Top 2 Boxes" score based on the histogram data.
- Input: An array of survey data, where each entry has optionId and label.
- Output: A JSON object containing the score and histogram of the top two boxes.

## Steps:

- The function first calculates the histogram using calculateHistogram(data).
- It then sums the frequencyPercentage values of the top two options (from the histogram).
- The function returns an object containing the following:
- calculation: A label for the type of calculation (top2boxes).
- sampleSize: The total number of responses.
- totalParticipants: The same as sampleSize.
- score: The sum of the frequencyPercentage of the top two options (rounded to four decimal places).
- histogram: The list of the top two options, as calculated by the histogram function.


## Example output:

'''
{
  "calculation": "top2boxes",
  "sampleSize": 4,
  "totalParticipants": 4,
  "score": 1.0000,
  "histogram": [
    {
      "optionId": 1,
      "label": "Option A",
      "order": 1,
      "frequencyCount": 2,
      "frequencyPercentage": 0.5000,
      "sampleSize": 4
    },
    {
      "optionId": 2,
      "label": "Option B",
      "order": 2,
      "frequencyCount": 1,
      "frequencyPercentage": 0.2500,
      "sampleSize": 4
    }
  ]
}
'''

## 3. Conclusion

The application processes survey data and calculates the most frequent responses using a histogram method. It then calculates the "Top 2 Boxes" score, which is the sum of the frequency percentages of the top two most selected options.

The project is built with the following key components:

- calculateHistogram: Computes the frequency and percentages of responses.
- calculateTop2Boxes: Calculates the overall "Top 2 Boxes" score and provides detailed statistics.
- This project provides insights into the responses from surveys, offering businesses a way to evaluate the most popular options in their forms or questionnaires.







# Node Express.js Boilerplate

A minimalistic Node.js and Express.js boilerplate to kickstart your web development projects. This boilerplate provides a solid foundation with essential configurations, allowing you to focus on building your application.


## Getting Started

### Prerequisites

Make sure you have Node.js and npm installed on your machine.


### Installation

1. **Install Dependencies:**

    ```bash
        npm install
    ```
2. **Start Project:**

    ```bash
        npm start
    ```
## Contributing
Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or create a pull request.


## Author
Dhawan Solanki

## Acknowledgments
Thanks to the Node.js and Express.js communities for their fantastic work.


