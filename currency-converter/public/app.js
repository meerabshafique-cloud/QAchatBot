const fromSelect = document.getElementById('from');
const toSelect = document.getElementById('to');
const form = document.getElementById('convert-form');
const resultEl = document.getElementById('result');
const swapBtn = document.getElementById('swap');

async function loadCurrencies() {
  try {
    const res = await fetch('/api/currencies');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load currencies');

    for (const code of data.currencies) {
      fromSelect.add(new Option(code, code));
      toSelect.add(new Option(code, code));
    }
    fromSelect.value = 'USD';
    toSelect.value = 'EUR';
  } catch (err) {
    resultEl.textContent = `Error loading currencies: ${err.message}`;
    resultEl.className = 'result error';
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const amount = document.getElementById('amount').value;
  const from = fromSelect.value;
  const to = toSelect.value;

  resultEl.textContent = 'Converting...';
  resultEl.className = 'result';

  try {
    const params = new URLSearchParams({ from, to, amount });
    const res = await fetch(`/api/convert?${params}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Conversion failed');

    resultEl.textContent = `${data.amount} ${data.from} = ${data.result.toFixed(4)} ${data.to} (rate: ${data.rate})`;
    resultEl.className = 'result success';
  } catch (err) {
    resultEl.textContent = `Error: ${err.message}`;
    resultEl.className = 'result error';
  }
});

swapBtn.addEventListener('click', () => {
  const tmp = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = tmp;
});

loadCurrencies();
