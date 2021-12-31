import * as echarts from 'echarts';

export type EChartsOption = echarts.EChartsOption;

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