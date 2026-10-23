# Evaluation Fixtures

This directory contains test fixtures for evaluating the technical chart analysis engine.

## Structure of a Fixture

Each fixture `.json` file contains:
- `name`: Descriptive name of the chart scenario
- `marketHint`: The expected or tested market pack (e.g. `us-equities`, `india-indices`)
- `expectedReadable`: boolean
- `expectedStance`: "long" | "short" | "wait" (optional)
- `images`: Base64-encoded test chart images

Run the evaluation suite via:
```bash
pnpm eval
```
