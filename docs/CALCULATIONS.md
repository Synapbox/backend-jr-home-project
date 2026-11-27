# How the metrics are calculated

Rating-scale questions ("How much do you agree…?", "Is this product for you?") are summarized with a few standard statistics. In market research the scale options are often called **boxes**, so a "top-2-boxes" score is the share of people who picked one of the two most positive boxes.

## Worked example

Scale (5 options, higher `value` = more positive):

| optionId | label | value |
|---|---|---|
| 11 | Very bad | 1 |
| 12 | Bad | 2 |
| 13 | Neutral | 3 |
| 14 | Good | 4 |
| 15 | Very good | 5 |

Responses, in the order received:

| # | participantId | optionId |
|---|---|---|
| 1 | 1 | 15 |
| 2 | 2 | 14 |
| 3 | 3 | 12 |
| 4 | 4 | 15 |
| 5 | 1 | 13 |

### Step 1: one answer per participant

Participant 1 answered twice (rows 1 and 5). Only the **last** answer counts, so participant 1's answer is `13`.

`responsesReceived = 5`, `sampleSize = 4`.

| participantId | optionId | value |
|---|---|---|
| 1 | 13 | 3 |
| 2 | 14 | 4 |
| 3 | 12 | 2 |
| 4 | 15 | 5 |

### Step 2: histogram

One row per scale option, highest value first, including options with 0 answers:

| value | count | percentage |
|---|---|---|
| 5 | 1 | 0.25 |
| 4 | 1 | 0.25 |
| 3 | 1 | 0.25 |
| 2 | 1 | 0.25 |
| 1 | 0 | 0 |

### Step 3: scores

| Metric | Which answers count | Calculation | Score |
|---|---|---|---|
| `top-2-boxes` | values 5 and 4 (the two highest) | 2 / 4 | **0.5** |
| `bottom-2-boxes` | values 1 and 2 (the two lowest) | 1 / 4 | **0.25** |
| `mean` | all | (3 + 4 + 2 + 5) / 4 | **3.5** |

## Notes

* "Two highest" and "two lowest" are always about `value`, **never** about the order the options arrive in or about `optionId`.
* Values don't have to start at 1. A 0–10 scale (values `0` to `10`) is valid: its top 2 boxes are 9 and 10, and its bottom 2 boxes are 0 and 1.
* On a 3-option scale, the middle option belongs to both the top 2 and the bottom 2. That's expected.
* Further reading: [Top 2 Box scores (Q Research Software)](https://help.qresearchsoftware.com/hc/en-us/articles/4418375534095-How-to-Compute-Top-2-Box-Scores).
