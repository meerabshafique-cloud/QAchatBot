// Fixed conversion rate: how many PKR make up 1 USD.
// Edit this single constant to update the rate used across the app.
const PKR_PER_USD = 278.5;

const SUPPORTED_CURRENCIES = ['PKR', 'USD'];

function convert({ amount, from, to }) {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    throw new Error('amount must be a number');
  }
  if (!SUPPORTED_CURRENCIES.includes(from)) {
    throw new Error(`from must be one of: ${SUPPORTED_CURRENCIES.join(', ')}`);
  }
  if (!SUPPORTED_CURRENCIES.includes(to)) {
    throw new Error(`to must be one of: ${SUPPORTED_CURRENCIES.join(', ')}`);
  }

  if (from === to) {
    return numericAmount;
  }
  if (from === 'PKR' && to === 'USD') {
    return numericAmount / PKR_PER_USD;
  }
  if (from === 'USD' && to === 'PKR') {
    return numericAmount * PKR_PER_USD;
  }

  throw new Error('unsupported conversion');
}

module.exports = { PKR_PER_USD, SUPPORTED_CURRENCIES, convert };
