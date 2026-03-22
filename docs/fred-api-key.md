# FRED / CPI inflation data

Past years use **`src/data/staticCpiYoYByYear.json`** (regenerate yearly: `node scripts/generate-static-cpi-yojson.mjs`).

Only **years on the hype chart** (the backtrack x-axis) are loaded from the JSON. **Live** refresh runs **only** for `cy−1` and `cy` **when those years are on the chart** — otherwise no CPI network calls (static only).

**Order for live years (gap-fill — first source wins, missing years come from the next):**

1. **FRED API** — if [`FRED_API_KEY`](https://fred.stlouisfed.org/docs/api/api_key.html) is set: [series/observations](https://fred.stlouisfed.org/docs/api/fred/series_observations.html) with `observation_start` = Jan of **`cy−2`** and a small `limit` (~52 monthly rows), not the full series history.
2. **World Bank** — compact JSON: [USA inflation %](https://data.worldbank.org/indicator/FP.CPI.TOTL.ZG?locations=US) (`FP.CPI.TOTL.ZG`), `date` range only around the years we need.
3. **FRED graph CSV** — same public URL, but we **parse only the last ~96 monthly rows** after download (CPU), plus a **15s** fetch timeout.

If none of the above fill a year, that year falls back to **`staticCpiYoYByYear.json`** where present.
