import { GradeUserData, Song } from "chelys";
import { mean, normalize, variance } from "./math";

export interface UserGradeResults {
  data: GradeUserData;
  normalizeScores: Map<number, number>, // SongId, Normalize Score
  mean: number;
  var: number;
}

export const EMPTY_USER_GRADE_RESULTS: UserGradeResults = {
  data: {uid: "", values: new Map()},
  normalizeScores: new Map(),
  mean: -1,
  var: -1
};

export interface SongGradeResult {
  id: number;
  score: number;
}

export interface SongGrade {
  song: Song;
  grade: number;
}

export function generateUserGradeResults(data: GradeUserData): UserGradeResults {
  const values = Array.from(data.values.values());
  const m = mean(values);
  const v = variance(m, values);
  const n = new Map();

  data.values.forEach((value, key) => {
    n.set(key, normalize(m, v, value));
  });

  return {
    data: data,
    normalizeScores: n,
    mean: m,
    var: v
  };
}