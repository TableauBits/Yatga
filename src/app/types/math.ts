export function mean(values: number[]): number {
  return values.reduce( (prev:number, current:number) => prev + current, 0) / values.length;
}

export function variance(mean: number, values: number[]): number {
  return values.reduce((prev:number, current:number) => {return prev + Math.pow(current - mean, 2); }, 0) / (values.length-1);
}

export function median(values: number[]): number {
  values.sort();
  const middle = Math.floor(values.length / 2);
  if (values.length % 2 === 0) return (values[middle - 1] + values[middle]) / 2;
  return values[middle];
}

export function normalize(mean: number, variance: number, value: number): number {
  if (value == mean) return 0;
  return (value - mean)/Math.sqrt(variance);
}

export function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}
