export function formatNumber(n: number): string {
  return n < 10 ? `0${n}` : n.toString()
}

export function formatDate(dt: Date): string {
  return `${formatNumber(dt.getDate())}/${formatNumber(dt.getMonth() + 1)}/${formatNumber(dt.getFullYear())} -` +
  ` ${formatNumber(dt.getHours())}:${formatNumber(dt.getMinutes())}`
}