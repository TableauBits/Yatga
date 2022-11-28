export function mean(values: number[]): number {
  return values.reduce( (prev:number, current:number) => prev + current, 0) / values.length;
}

export function variance(mean: number, values: number[]): number {
  return values.reduce((prev:number, current:number) => {return prev + Math.pow(current - mean, 2); }, 0) / (values.length-1);
}

export function normalize(mean: number, variance: number, value: number): number {
  if (value == mean) return 0;
  return (value - mean)/Math.sqrt(variance);
}

export function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}
