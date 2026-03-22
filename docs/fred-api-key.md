# FRED / CPI inflation data

Past years use **`src/data/staticCpiYoYByYear.json`** (regenerate yearly: `node scripts/generate-static-cpi-yojson.mjs`).

The **last two calendar years** (`cy−1`, `cy`) are refreshed live (revisions + new year); older years stay in the JSON.

**Order for `cy−1` / `cy` (gap-fill — first source wins, missing years come from the next):**

1. **FRED API** — if [`FRED_API_KEY`](https://fred.stlouisfed.org/docs/api/api_key.html) is set: [series/observations](https://fred.stlouisfed.org/docs/api/fred/series_observations.html) with `observation_start` ≈ three years back (~36 monthly rows).
2. **World Bank** — small JSON: [USA inflation %](https://data.worldbank.org/indicator/FP.CPI.TOTL.ZG?locations=US) (`FP.CPI.TOTL.ZG`). Annual figures; may differ slightly from monthly CPI YoY.
3. **FRED graph CSV** — public [`fredgraph.csv`](https://fred.stlouisfed.org/series/CPIAUCSL); request uses a **15s timeout** so SSR does not hang if the host stalls.

If none of the above fill a year, that year falls back to **`staticCpiYoYByYear.json`** where present.
