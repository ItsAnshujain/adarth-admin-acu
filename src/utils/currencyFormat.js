const toIndianCurrency = (num = 0) => {
  const curr = num.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return curr;
};

export default toIndianCurrency;
