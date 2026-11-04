# Cleaned analysis

`analyze_cleaned.R` reads private JSON response files, applies the complete quality-control pipeline, fits the statistical models, and writes aggregate results and figures.

## Exclusion rules

Participant-level exclusions:

- Turkish is not reported as a native language
- either of the two attention checks is failed
- 5 or more clear filler errors out of 16, where a good filler rated 1 to 3 or a bad filler rated 5 to 7 counts as an error
- median response time across critical and filler trials is below 3 seconds or above 60 seconds

Trial-level exclusions:

- the participant's timing interpretation does not match the intended real-time or after-event condition
- the timing response is unclear or missing
- the critical-trial response time is below 1 second or above 180 seconds

## Analysis snapshot

For the 2026-11-04 snapshot:

- 256 completed response files
- 234 included participants
- 3,744 critical trials before timing and trial-response-time filtering
- 2,763 timing-congruent critical trials
- 2,744 final critical trials after trial-response-time filtering

## Models

The primary model is a cumulative-link mixed model with a full `marker * timing * strength * source` fixed-effects structure and participant and item random intercepts.

Robustness checks include:

- a cumulative-link mixed model with participant timing slopes and item marker slopes
- a continuous-rating linear mixed model with the same random-slopes structure
- leave-one-item-out sensitivity analyses for the strong-evidence marker-by-timing difference-in-differences

The primary omnibus tests compare the full model with reduced models that remove all fixed-effect terms involving both marker and each target predictor.

## Reproducing the analysis

Install the R packages `jsonlite`, `dplyr`, `ggplot2`, `ordinal`, `emmeans`, `lme4`, and `scales`. Then run:

```sh
TR_EVIDENTIALS_DATA_DIR=/path/to/private/json \
TR_EVIDENTIALS_OUTPUT_DIR=analysis/results/cleaned-analysis \
Rscript analysis/analyze_cleaned.R
```

To create a local review copy of the proposed deidentified dataset, also set `TR_EVIDENTIALS_PUBLIC_DATA_DIR`. Do not publish that output without PI or IRB confirmation.

## Outputs

- `figures/`: poster-ready PDF and PNG figures
- `results/`: aggregate exclusion counts, model comparisons, estimated means, robustness summaries, and a text report

No raw or identifiable response data are committed.
