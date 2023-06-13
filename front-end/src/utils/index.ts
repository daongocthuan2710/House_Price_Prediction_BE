export const priceFormat = (price: number, currency: string) => {
  return `${String(price).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} ${currency}`;
};
