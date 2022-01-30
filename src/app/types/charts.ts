import * as echarts from 'echarts';

export const CHARTS_ID_LENGTH = 12;

export type EChartsOption = echarts.EChartsOption;

// Pie
export type PieData = {
  value: number;
  name: string;
}

// Radar
export type RadarIndicator = {
  name: string;
  max: number;
}
export type RadarData = {
  value: number[];
  name: string;
}

// Scatter
export type ScatterData = [
  number, // Axis Id
  number, // Position
  number  // Size
];
