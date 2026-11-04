# Turkish evidentiality experiment

This repository contains the experiment and reproducible analysis for a Turkish evidentiality acceptability-judgment study. The study tests how information-acquisition timing, evidence strength, and evidence source affect the distribution of `-DI` and `-mIş`.

## Study links

- Live study: <https://busramarsan.com/tr-evidentials_exp/>
- Experiment source: [`experiment` branch](https://github.com/iambusra/tr-evidentials_exp/tree/experiment)
- Cleaned analysis: [`analysis/analyze_cleaned.R`](analysis/analyze_cleaned.R)

## Repository structure

- `analysis/`: cleaning rules, statistical models, aggregate results, and poster-ready figures
- `data/`: data-sharing documentation
- `experiments/`: notes about the deployed experiment
- `model/`: reserved for computational modeling

## Data privacy

Raw response files are not stored in this public repository. They contain collection identifiers and other fields that are unnecessary for reproducibility.

A proposed deidentified analysis dataset is documented in [`data/README.md`](data/README.md). It will not be published here until the PI or IRB confirms that public GitHub release is consistent with the approved protocol and consent language.

## Current cleaned sample

The analysis snapshot dated 2026-11-04 contains:

- 256 completed response files
- 234 included native Turkish speakers who passed both attention checks and all participant-level quality rules
- 2,744 timing-congruent critical trials after trial-level response-time filtering

See [`analysis/README.md`](analysis/README.md) for exact exclusion rules and model specifications.
