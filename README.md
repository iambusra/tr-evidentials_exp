# Turkish evidentiality acceptability experiment

A static, Turkish-language acceptability-judgment experiment for GitHub Pages.

## Design

- 38 critical items
- 8 context conditions: evidence source (speaker's own or reportative), evidence strength (strong or weak), and acquisition timing (real time or after the fact)
- 2 target markers: -DI and -mIş
- 24 available fillers, balanced between clearly good and clearly bad
- 3 guided practice trials with immediate feedback
- 2 explicit instruction-based attention checks
- 7-point Likert scale
- 19 content lists per marker, producing 38 assignment lists
- Source-specific consent and completion flows for Prolific and network recruitment

Each participant completes 3 practice trials, followed by 16 critical trials, the configured number of fillers, and 2 attention checks. The practice trials explain the expected response range after each answer. The attention checks explicitly tell the participant which scale point to select and are inserted at approximately one-third and two-thirds of the randomized main sequence.

The marker is between participants. A participant sees only -DI critical targets or only -mIş critical targets. Each list contains exactly two critical items from each of the eight context conditions, for 16 unique critical items. Across the 19 content lists for a marker, every item appears exactly once in every context condition. The same 19-list cycle is repeated for the other marker. Critical items and fillers are mixed in a seeded random order, with runs longer than four trials of one type rejected.

The assignment list is derived from the participant ID. For controlled testing, add `?list=1` through `?list=38` to the study URL.

Participant-ID hashing distributes participants approximately across the 38 lists, but it does not guarantee equal list sizes. To guarantee `k` observations in every condition-marker cell for every item, assign exactly `k` participants to each list, for a total of `38 × k` participants. The `?list=` URL parameter supports externally balanced assignment.

## Configure before collecting data

Edit `public/experiment-config.js`:

- Set `endpoint` to an HTTPS submission endpoint.
- Set `raffleEndpoint` to the HTTPS endpoint that stores raffle emails separately.
- Set `prolificCompletionUrl` to the Prolific completion URL.
- Set `proofOfHumanSiteKey` to the public Proof of Human site key. Keep the secret API key on the server.
- Set `fillerCount` after the final per-participant filler count is decided.
- Change `studyId` when creating a new study version.

The endpoint URL is public because it runs in participants' browsers. Never put an API key, database password, service-role key, or other secret in this repository.

The submitted schema is version 3. It contains recruitment source, the between-participant marker, content-list assignment, demographics, practice responses, Proof of Human session ID when available, and main-trial responses. Every main-trial row includes `responseTimeMs`, measured from display of the trial until the participant presses Continue. Attention-check rows have `itemType: "attention"`, `attentionExpected`, and `attentionPassed` fields. Submission begins automatically after the final trial. No response payload is committed to or generated inside the repository.

For network participants, a successful experiment submission must return a one-time `raffleToken`. The separate raffle form sends only the token and email address to `raffleEndpoint`. The email address is never added to the experiment-response payload.

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

Use `?source=prolific` in the Prolific study link. Without Prolific parameters the experiment generates random participant and session IDs. A URL-supplied `participant_id` is also supported.

For network recruitment, use `?source=network`. The network landing page and consent form describe the 1,000 TL Amazon gift-card drawing, and the completion page offers the separate raffle email form.

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
