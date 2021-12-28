import { GradeUserData } from "chelys";
import { mean, normalize, variance } from "./math";

export interface UserGradeResults {
  data: GradeUserData;
  normalizeScores: Map<number, number>, // SongId, Normalize Score
  mean: number;
  var: number;
}

export function generateUserGradeResults(data: GradeUserData): UserGradeResults {
  const values = Array.from(data.values.values());
  const m = mean(values);
  const v = variance(m, values);
  const n = new Map();

  data.values.forEach((value, key) => {
    n.set(key, normalize(m, v, value));
  })

  return {
    data: data,
    normalizeScores: n,
    mean: m,
    var: v
  }
}