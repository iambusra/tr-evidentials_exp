# Turkish evidentiality acceptability experiment

A static, Turkish-language acceptability-judgment experiment for GitHub Pages.

## Design

- 38 critical items
- 8 context conditions: evidence source (speaker's own or reportative), evidence strength (strong or weak), and acquisition timing (real time or after the fact)
- 2 target markers: -DI and -mIş
- 24 fillers, balanced between clearly good and clearly bad
- 3 guided practice trials with immediate feedback
- 2 explicit instruction-based attention checks
- 7-point Likert scale
- 16 counterbalancing lists

Each participant completes 3 practice trials, followed by 64 main trials: 38 critical items, 24 fillers, and 2 attention checks. The practice trials explain the expected response range after each answer. The attention checks explicitly tell the participant which scale point to select and are inserted at fixed intervals in the randomized main sequence.

Each participant sees every critical item once, in exactly one context condition and with exactly one target marker. Across lists, every item rotates through all 16 condition-marker combinations. Each list contains 19 -DI and 19 -mIş critical targets. Critical items and fillers are mixed in a seeded random order, with runs longer than four trials of one type rejected.

The list is derived from the participant ID. For controlled testing, add `?list=1` through `?list=16` to the study URL.

Participant-ID hashing distributes participants approximately across the 16 lists, but it does not guarantee equal list sizes. To guarantee `k` observations in every condition-marker cell for every item, assign exactly `k` participants to each list, for a total of `16 × k` participants. The `?list=` URL parameter supports externally balanced assignment.

## Configure before collecting data

Edit `public/experiment-config.js`:

- Replace every bracketed consent placeholder.
- Set `endpoint` to an HTTPS submission endpoint.
- Set `completionUrl` if participants should return to Prolific or another platform.
- Change `studyId` when creating a new study version.

The endpoint URL is public because it runs in participants' browsers. Never put an API key, database password, service-role key, or other secret in this repository.

The submitted schema is version 2. It contains demographics, practice responses, and main-trial responses. Every main-trial row includes `responseTimeMs`, measured from display of the trial until the participant presses Continue. Attention-check rows have `itemType: "attention"`, `attentionExpected`, and `attentionPassed` fields. Submission begins automatically after the final trial. No response payload is committed to or generated inside the repository.

Your endpoint must:

- accept HTTPS `POST` requests with JSON;
- validate the payload and reject unexpected fields or oversized requests;
- allow CORS only from the final GitHub Pages origin and local development origins you explicitly use;
- rate-limit requests;
- write to a private database or storage bucket using credentials held only on the server;
- de-duplicate by `session.sessionId`;
- return a 2xx response, optionally with `{"confirmationCode":"..."}`.

Suitable endpoint implementations include an institutional server, a Cloudflare Worker, a Supabase Edge Function, or another serverless function backed by access-controlled storage. The static site itself never writes data to GitHub, browser storage, or the JavaScript console.

## Prolific

The experiment reads Prolific's standard URL parameters when present:

- `PROLIFIC_PID`
- `STUDY_ID`
- `SESSION_ID`

Without those parameters it generates random participant and session IDs. A URL-supplied `participant_id` is also supported.

## Local check

```sh
npm install
npm test
npm run dev
```

Open `http://localhost:3000`.

## GitHub Pages

1. Put these files at the root of a GitHub repository.
2. In repository settings, set Pages to use GitHub Actions.
3. Push to the `experiment` branch.

The included workflow validates the design, creates a static export, and deploys the `out` directory. The public `.nojekyll` file ensures GitHub Pages serves Next.js assets whose directory begins with an underscore.

## Data protection

No participant responses belong in this repository. Common response-data paths and database formats are ignored by Git. Keep raw data in the access-controlled system behind the submission endpoint. Restrict access to the approved research team and follow the retention schedule in the consent and ethics documents.
