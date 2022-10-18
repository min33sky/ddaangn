export function currencyFormat(price: number) {
  return price.toLocaleString('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  });
}
