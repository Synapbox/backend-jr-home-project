# Synapbox Backend Home Project: Survey Metrics API

Thanks for taking the time to do this project. 👋

At Synapbox we run market-research studies: people watch an ad or look at a product and then answer questions such as *"Is this product for you?"* on a rating scale. Our backend turns those answers into **metrics** that researchers put in front of brands.

You'll build a small API that does the same thing. It's a real problem from our domain, simplified.

**Please read the whole document before you start.** The [FAQ](#faq) answers most questions.

---

## What we evaluate

| Area | Weight | What we look at |
|---|---|---|
| **Requirements** | 40% | Does it do what the contract below says? We run an automated test suite against your API using **data you haven't seen**. |
| **Code quality** | 25% | Readable names, small focused functions, clear error handling, no dead code, no copy-paste. |
| **Code organization** | 20% | A sensible structure: where the HTTP code lives, where the calculation logic lives, and how easy it would be to add a new metric. |
| **Tests** | 10% | Do your tests cover the rules and edge cases that matter? Do they pass? |
| **Communication** | 5% | Your `NOTES.md`, your README instructions, and your commit history. |

After you submit, we'll have a **45-minute call**. You'll walk us through your code and make a small change to it live. You can use your usual tools during the call, including AI. It's a conversation, not an exam. We mainly want to see that you understand the code you sent.

---

## Level 1: Required

### Background: the metrics

A question has a **scale**: a list of 3 to 11 options. Each option has a numeric `value`, and a higher value means a more positive answer. Each **participant** picks one option.

| Metric id | Score |
|---|---|
| `top-2-boxes` | Share of participants (0–1) who picked one of the **two highest-value** options |
| `bottom-2-boxes` | Share of participants (0–1) who picked one of the **two lowest-value** options |
| `mean` | Average `value` of the picked options |

[`docs/CALCULATIONS.md`](docs/CALCULATIONS.md) has a worked example. Please read it.

### 1. `POST /calculations/:metric`

Calculates one metric (`top-2-boxes`, `bottom-2-boxes` or `mean`) for the answers in the body.

**Request body**

```json
{
  "scale": [
    { "optionId": 47077, "label": "Definitivamente NO es para mí", "value": 1 },
    { "optionId": 47078, "label": "Probablemente NO es para mí", "value": 2 },
    { "optionId": 47079, "label": "Podría ser como podría no ser para mí", "value": 3 },
    { "optionId": 47080, "label": "Probablemente SÍ es para mí", "value": 4 },
    { "optionId": 47081, "label": "Definitivamente SÍ es para mí", "value": 5 }
  ],
  "responses": [
    { "participantId": 2166342, "optionId": 47081 },
    { "participantId": 2166123, "optionId": 47079 }
  ]
}
```

**Response `200`**

```json
{
  "metric": "top-2-boxes",
  "score": 0.7033,
  "responsesReceived": 300,
  "sampleSize": 300,
  "histogram": [
    { "optionId": 47081, "label": "Definitivamente SÍ es para mí", "value": 5, "count": 53, "percentage": 0.1767 },
    { "optionId": 47080, "label": "Probablemente SÍ es para mí", "value": 4, "count": 158, "percentage": 0.5267 },
    { "optionId": 47079, "label": "Podría ser como podría no ser para mí", "value": 3, "count": 64, "percentage": 0.2133 },
    { "optionId": 47078, "label": "Probablemente NO es para mí", "value": 2, "count": 13, "percentage": 0.0433 },
    { "optionId": 47077, "label": "Definitivamente NO es para mí", "value": 1, "count": 12, "percentage": 0.04 }
  ]
}
```

**Business rules**

1. **One answer per participant.** If a participant appears more than once in `responses`, only their **last** response (in array order) counts.
2. `responsesReceived` is the length of `responses`. `sampleSize` is the number of participants counted after rule 1.
3. `histogram` has **one row per scale option, including options nobody picked**, sorted by `value` from highest to lowest. The scale in the request can come in any order.
4. `percentage` is `count / sampleSize`, as a proportion from 0 to 1 (not 0 to 100).
5. `score` and `percentage` are rounded to **4 decimal places**.
6. If `responses` is empty, return `200` with `"score": null`, `"sampleSize": 0`, and every `count` and `percentage` set to `0`.
7. Fields we don't define (for example, a `label` inside a response) are ignored.

**Errors.** Every error response has this shape:

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "a human-readable explanation" } }
```

| Situation | Status | `code` |
|---|---|---|
| Body isn't valid JSON, or isn't an object with `scale` and `responses` | 400 | `VALIDATION_ERROR` |
| `scale` isn't an array of 3–11 options, or an option lacks an integer `optionId`, a non-empty `label` or an integer `value` | 400 | `VALIDATION_ERROR` |
| Two scale options share the same `optionId` or the same `value` | 400 | `VALIDATION_ERROR` |
| `responses` isn't an array, or an item lacks a positive integer `participantId` or an integer `optionId` | 400 | `VALIDATION_ERROR` |
| A response uses an `optionId` that isn't in the scale | 422 | `UNKNOWN_OPTION` |
| `:metric` isn't one of the supported metrics | 404 | `UNKNOWN_METRIC` |

### 2. `GET /metrics`

Lists the supported metrics, so clients don't have to hard-code them.

```json
{
  "metrics": [
    { "id": "top-2-boxes", "description": "Share of participants who chose one of the two highest-value options (0–1)." },
    { "id": "bottom-2-boxes", "description": "…" },
    { "id": "mean", "description": "…" }
  ]
}
```

### 3. Tests

`npm test` must run your tests and pass. We're not looking for 100% coverage. We want to see that you tested the rules above that are easy to get wrong.

### 4. `NOTES.md`

Fill in [`NOTES.md`](NOTES.md). It's short, and we read it before the call.

### Check your work

[`data/sample-request.json`](data/sample-request.json) is a real study with 300 participants. For that file your API should return:

| Metric | Score |
|---|---|
| `top-2-boxes` | `0.7033` |
| `bottom-2-boxes` | `0.0833` |
| `mean` | `3.7567` |

[`data/sample-request-with-segments.json`](data/sample-request-with-segments.json) contains the same study with demographic segments added, plus a few participants who answered twice. Use it for Level 2, option A, and to test rule 1.

Our evaluation datasets are different. They use other scale sizes, other ids and other edge cases, so build to the rules, not to the sample numbers.

---

## Level 2: Pick **one**

Choose the option you find most interesting and tell us why in `NOTES.md`. **One option done well beats three done halfway.** You won't earn extra points for doing more than one.

### A. Segment breakdown

Researchers want results per audience group. Responses may carry segments:

```json
{ "participantId": 2166342, "optionId": 47081, "segments": { "gender": "female", "ageGroup": "25-34" } }
```

Support `POST /calculations/:metric?breakdownBy=<attribute>`. The response keeps all the total fields and adds:

```json
"breakdown": [
  { "segment": "18-24", "score": 0.7576, "sampleSize": 66, "histogram": [ ... ] },
  { "segment": "25-34", "score": 0.6471, "sampleSize": 68, "histogram": [ ... ] },
  { "segment": null,    "score": 0.6,    "sampleSize": 5,  "histogram": [ ... ] }
]
```

* Apply rule 1 (last answer wins) **before** grouping.
* Sort segments alphabetically. Participants who don't have the attribute go into a final `null` group.

### B. Stored questions

Instead of sending every answer on each request, clients create a question once and send responses in batches.

| Endpoint | Body | Success |
|---|---|---|
| `POST /questions` | `{ "text": "¿Es para ti?", "scale": [...] }` | `201` with `{ "id", "text", "scale" }` |
| `GET /questions/:id` | – | `200` with `{ "id", "text", "scale" }` |
| `POST /questions/:id/responses` | `{ "responses": [...] }` | `201` |
| `GET /questions/:id/metrics/:metric` | – | `200`, same body as `POST /calculations/:metric` |

* Rule 1 applies across batches: a later batch can replace a participant's earlier answer.
* A batch with any invalid response is rejected **as a whole** (nothing is stored).
* An unknown question returns `404` with code `QUESTION_NOT_FOUND`.
* Storage is your choice: in memory, a JSON file, SQLite or Postgres. Explain the trade-off you made in `NOTES.md`.

### C. Ship it

Add a `Dockerfile` (so that `docker build` and `docker run` start the API) and a GitHub Actions workflow that runs linting and your tests on every push. Add a linter and a formatter if you don't have them yet.

### D. API documentation

Write an OpenAPI 3 description of the API and serve interactive docs at `GET /docs`. Keep the spec and the code from drifting apart, and tell us how you did that.

### E. Your own idea

Something you think a real user of this API would need. Describe the problem in `NOTES.md` before you describe your solution.

---

## Using AI tools

**You can use them.** We use AI tools every day, and we'd rather see how you use them than pretend they don't exist.

What we ask:

* **Own every line.** In the call we'll ask about any part of the code. "The AI wrote it" isn't an answer, but "the AI suggested X, and I changed it to Y because…" is a great one.
* **Be honest in `NOTES.md`** about which tools you used and for what. Using AI won't cost you points. Hiding it or not understanding what it produced will.
* **Commit as you go.** Small commits with clear messages show us how you worked. Please don't squash everything into one commit.

---

## Timebox and submission

* We expect **about 4–6 hours of focused work** in total for Level 1 plus one Level 2 option. Please don't spend your whole week on it. If you run out of time, write what's missing and how you'd do it in `NOTES.md`.
* You have **5 calendar days** from when you receive this.
* **Create your own repository** from this one: either GitHub's **"Use this template"** button, or clone this repository and push it to a new one. Please don't open pull requests against this repository.
* The repository can be public or private. If it's private, invite the reviewers named in the email you received.
* Reply to that email with the link when you're done.

---

## Starter project

The starter code is a minimal Express 5 app with a health check and one example test.

```bash
nvm use          # Node 24 (any version >= 22 works)
npm install
npm run dev      # starts on http://localhost:5050 and restarts on save
npm test
```

```bash
curl -s -X POST localhost:5050/calculations/top-2-boxes \
  -H 'content-type: application/json' \
  -d @data/sample-request.json
```

---

## FAQ

**Can I change the structure, framework or language?**
Yes. Express, Fastify and NestJS are all fine, and so is TypeScript (we use it at Synapbox). Please stay on **Node.js**, keep `npm start` and `npm test` working, and keep the API on the port given by `PORT` (default `5050`). The HTTP contract above is the only fixed part.

**Should I add a database, authentication or logging?**
Only if your Level 2 option needs it. We'd rather see a focused, clean project than a large one. Adding things nobody asked for counts as a code-quality issue, not a bonus.

**Something in the spec is unclear or seems wrong.**
That happens in real work too. Make a reasonable decision, write it down in `NOTES.md` with your reasoning, and keep going. You can also email us. We'll answer within one business day, but don't block on it.

**Do you check the exact wording of error messages?**
No. We check the status code and `error.code`. The message is for humans.
