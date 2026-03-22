# Server timing debug (Vercel)

La homepage e le lib di mercato loggano durate con il prefisso **`[server-timing]`**.

## Cosa compare nei log

- **`⚠️ SLOW (≥10000ms)`** — quella sezione ha superato **10 secondi** (tipico limite Vercel Hobby). Da ottimizzare per prima.
- Senza env extra, solo le sezioni **≥10s** vengono loggate (`console.warn`), così i log di produzione restano puliti.

## Log di tutte le sezioni (anche veloci)

Imposta su Vercel (o in `.env.local`):

```bash
DEBUG_PAGE_TIMING=1
```

Poi in **Deployments → Functions → View logs** vedrai ogni step (`home:…`, `overlay:…`, `market:…`, `cpi:…`, `social:…`).

## Etichette utili

| Prefisso | Significato |
|----------|-------------|
| `home:totalWallTime` | Tempo totale della richiesta `/` (SSR). |
| `home:fetchMarketYearlyOverlay` | Overlay storico (include sotto-log `overlay:*` e `cpi:*`). |
| `home:fetchMarketSnapshot` | Sidecar prezzi + sotto-log `market:resolve*`. |
| `social:*` | Reddit / YouTube / Facebook+Jina / Threads+Jina in parallelo. |
| `cpi:fredApi` / `cpi:worldBank` / `cpi:fredGraphCsv` | Catena inflazione live. |

Implementazione: `src/lib/serverTiming.ts`.
