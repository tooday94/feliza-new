const formatPrice = (num) => {
  return num.toLocaleString("en-US").replace(/,/g, " ");
};

export default formatPrice;
