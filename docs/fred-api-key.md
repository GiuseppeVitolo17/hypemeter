# FRED / CPI inflation data

Past years use **`src/data/staticCpiYoYByYear.json`** (regenerate yearly: `node scripts/generate-static-cpi-yojson.mjs`).

The **last two calendar years** (`cy−1`, `cy`) are refreshed live (revisions + new year); older years stay in the JSON.

- **With** [`FRED_API_KEY`](https://fred.stlouisfed.org/docs/api/api_key.html): [series/observations](https://fred.stlouisfed.org/docs/api/fred/series_observations.html) with `observation_start` ≈ three years back (~36 monthly rows).
- **Without** a key: one request to the public [`fredgraph.csv`](https://fred.stlouisfed.org/series/CPIAUCSL) — YoY for `cy−1` and `cy` are read from the parsed series; older years stay in the JSON.
