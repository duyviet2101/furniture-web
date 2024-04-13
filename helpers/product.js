module.exports.priceNewProducts = (products) => {
  return products.map((product) => {
    const newPrice = product.price - (product.price * product.discountPercentage / 100);
    return {
      ...product,
      newPrice,
    };
  });
}

module.exports.priceNewProduct = (product) => {
  const newPrice = product.price - (product.price * product.discountPercentage / 100);
  return {
    ...product,
    newPrice,
  };
}