const form = document.getElementById('convert-form');
const amountInput = document.getElementById('amount-input');
const directionSelect = document.getElementById('direction-select');
const resultBox = document.getElementById('result-box');
const rateDisplay = document.getElementById('rate-display');

async function loadRate() {
  const res = await fetch('/api/currency/rate');
  const { pkrPerUsd } = await res.json();
  rateDisplay.textContent = `1 USD = ${pkrPerUsd} PKR`;
}

function directionToCurrencies(direction) {
  return direction === 'PKR_TO_USD'
    ? { from: 'PKR', to: 'USD' }
    : { from: 'USD', to: 'PKR' };
}

async function convert(amount, from, to) {
  const res = await fetch('/api/currency/convert', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, from, to }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'conversion failed');
  }
  return data;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const amount = amountInput.value;
  const { from, to } = directionToCurrencies(directionSelect.value);

  try {
    const { result } = await convert(amount, from, to);
    resultBox.textContent = `${amount} ${from} = ${result.toFixed(2)} ${to}`;
    resultBox.classList.remove('error');
  } catch (err) {
    resultBox.textContent = err.message;
    resultBox.classList.add('error');
  }
});

loadRate();
