export function kebabToTitle(value: string): string {
  return value
    .split("-")
    .filter(Boolean)
    .map((w) => (w[0] ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}
