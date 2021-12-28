export function mean(values: number[]): number {
  return values.reduce( (prev:number, current:number) => prev + current, 0) / values.length;
}

export function variance(mean: number, values: number[]): number {
  return values.reduce((prev:number, current:number) => {return prev + Math.pow(current - mean, 2) }, 0) / (values.length-1);
}