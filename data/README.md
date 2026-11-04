# Data availability and privacy

Raw participant files are stored privately and are not included in this repository.

## Proposed public analysis dataset

The analysis script can generate a minimal trial-level dataset containing only:

- `subject_id`: random study-specific label such as `S001`, with no public lookup table
- `item_id`: critical stimulus identifier
- `marker`: `di` or `mis`
- `acquisition_timing`: `realtime` or `after`
- `evidence_strength`: `strong` or `weak`
- `evidence_source`: `own` or `reportative`
- `rating`: acceptability judgment from 1 to 7
- `response_time_ms`: acceptability-judgment response time

The proposed public file excludes collection identifiers, Prolific identifiers, session identifiers, timestamps, completion dates, email addresses, demographics, country, gender, age, time zone, recruitment source, and free-text responses. The original-to-public subject mapping is not retained.

Only final cleaned critical trials are included. Separate aggregate files report the exclusion flow and data dictionary without participant-level exclusion details.

## Release gate

This deidentified trial-level dataset is not committed yet. Public GitHub release requires confirmation from the PI or IRB that open distribution is consistent with the approved protocol and consent language. If open release is not approved, use an access-controlled repository instead.
