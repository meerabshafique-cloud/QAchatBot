# Currency Converter

A small standalone app for converting between currencies using live exchange rates.

## Setup

```bash
cd currency-converter
npm install
npm start
```

The server listens on port `4000` by default (override with the `PORT` env var). Open http://localhost:4000 in a browser.

## API

- `GET /api/currencies` — list of supported currency codes.
- `GET /api/convert?from=USD&to=EUR&amount=10` — converts `amount` from `from` to `to`, returns `{ from, to, amount, rate, result }`.

## Data source

Exchange rates come from [open.er-api.com](https://www.exchangerate-api.com/docs/free) — a free API that requires no API key.
