# Google Drive data receiver

This Apps Script web app writes experiment responses to a private folder in the
deploying Stanford account. It stores raffle email addresses in a separate
private spreadsheet. No participant data or server secret belongs in GitHub.

## Storage layout

- `<studyId>_PRIVATE_RESPONSES`: one JSON file per completed session
- `<studyId>_PRIVATE_RAFFLE`: a spreadsheet containing raffle eligibility token
  hashes and a separate email-only entry sheet

The experiment response never contains a raffle email. The email entry never
contains a participant ID, session ID, response-file name, or raffle token.

## Setup

1. Sign into the Stanford Google account that should own the data.
2. Create a standalone Apps Script project and add `Code.gs` and
   `appsscript.json` from this directory.
3. Run `setupExperimentStorage` once and approve only the requested Drive and
   Sheets permissions.
4. Confirm `getStorageStatus` reports both storage locations and the token secret
   as configured. Collection remains closed at this point.
5. Deploy a Web app that executes as the deploying account and allows anonymous
   access. Copy the `/exec` URL, not the `/dev` test URL.
6. Put the `/exec` URL in both `endpoint` and `raffleEndpoint` in
   `public/experiment-config.js`.
7. Run an end-to-end test submission. Check that one JSON response file and one
   raffle entry are created in their separate locations.
8. Run `startCollection` immediately before recruitment. Run `stopCollection`
   when collection ends.

If the Stanford Workspace administrator does not offer anonymous web-app access,
do not deploy from a personal Google account. Use an approved institutional or
serverless endpoint that writes to the Stanford-controlled storage instead.

## Safeguards

- strict schema and trial-count validation
- request-size and global rate limits
- duplicate-session detection
- deterministic confirmation codes
- one-use raffle eligibility tokens
- spreadsheet formula-injection protection
- collection closed by default
- all credentials and storage identifiers held in private Script Properties

The public endpoint URL is not a password. Anyone can discover it in the browser,
so the receiver does not treat it as an authentication secret.
