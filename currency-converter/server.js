const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.static(path.join(__dirname, 'public')));

async function fetchRates(base) {
  const res = await fetch(`https://open.er-api.com/v6/latest/${base}`);
  if (!res.ok) {
    throw new Error(`Upstream API responded with status ${res.status}`);
  }
  const data = await res.json();
  if (data.result !== 'success') {
    throw new Error('Upstream API returned an error result');
  }
  return data.rates;
}

app.get('/api/currencies', async (req, res) => {
  try {
    const rates = await fetchRates('USD');
    res.json({ currencies: Object.keys(rates).sort() });
  } catch (err) {
    res.status(502).json({ error: 'Failed to fetch currency list from upstream API', details: err.message });
  }
});

app.get('/api/convert', async (req, res) => {
  const { from, to, amount } = req.query;

  if (!from || !to || !amount) {
    return res.status(400).json({ error: 'Query params "from", "to", and "amount" are required' });
  }

  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount) || numericAmount < 0) {
    return res.status(400).json({ error: 'Query param "amount" must be a non-negative number' });
  }

  const fromCode = String(from).toUpperCase();
  const toCode = String(to).toUpperCase();

  try {
    const rates = await fetchRates(fromCode);

    if (!rates[toCode]) {
      return res.status(400).json({ error: `Unknown currency code: ${toCode}` });
    }

    const rate = rates[toCode];
    const result = numericAmount * rate;

    res.json({ from: fromCode, to: toCode, amount: numericAmount, rate, result });
  } catch (err) {
    res.status(502).json({ error: 'Failed to fetch exchange rate from upstream API', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Currency converter listening on port ${PORT}`);
});
