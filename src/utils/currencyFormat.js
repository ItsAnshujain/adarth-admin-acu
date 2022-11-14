const toIndianCurrency = (num = 0) => {
  const curr = num.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
  });
  return curr;
};

export default toIndianCurrency;
