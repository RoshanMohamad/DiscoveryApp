/** 21,919,000 style grouping. Pure, so it is testable and locale-stable. */
export const formatNumber = (value: number): string =>
  Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
