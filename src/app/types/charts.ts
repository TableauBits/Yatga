import * as echarts from 'echarts';
import { isNil } from 'lodash';
import echartsTheme from '../../styles/echarts-theme.json';

echarts.registerTheme('dark', echartsTheme);

export type EChartsOption = echarts.EChartsOption;

export abstract class Charts {
  id: string;

  private chart: echarts.ECharts | undefined;
  private option: EChartsOption;
  
  constructor() {
    this.id = "";
    this.chart = undefined;
    this.option = {};
  }

  onResize() {
    this.chart?.resize({
      width: "auto",
      height: "auto",
    });
  }

  updateChart(): void {
    const element = document.getElementById(this.id);
    if (isNil(this.chart) && !isNil(element)) {
      this.chart = echarts.init(element!, 'dark');
    }
    this.option = this.generateChartOption();
    this.option && this.chart?.setOption(this.option);
  }
  
  abstract generateChartOption(): EChartsOption;
}

// Calendar
export type CalendarData = [
  string, // data {yyyy}-{MM}-{dd}
  number, // value
]

// Chord
export type ChordCategory = {
  name: string;
}

export type ChordLink = {
  source: string;
  target: string;
  lineStyle: {
    width: number,
    curveness: number,
    opacity: number
  },
  value: number;
}

export type ChordNode = {
  id: string;
  name: string;
  symbolSize: number;
  x: number | undefined;
  y: number | undefined;
  value: number;
  category: number;
  label: {
    show: boolean;
  }
}

// Heatmap
export type HeatmapData = [
  number, // y
  number, // x
  number, // Value
]

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
export type ScatterConfig = {
  axisMax: number;
  axisLabelInterval?: number;
  bubbleSizeMultiplier: number;
  formatter?: (param: any) => string;
  color?: string;
  data: ScatterData[];
  names: string[];
}

export type ScatterData = [
  number, // Axis Id
  number, // Position
  number  // Size
];

export const EMPTY_SCATTER_CONFIG: ScatterConfig = {
  axisMax: 0,
  bubbleSizeMultiplier: 0,
  data: [],
  names: []
};

// Simple Scatter
export type SimpleScatterConfig = {
  color?: string;
  data: Array<[number, number, number]>;
  formatter?: (param: any) => string;
  symbolSize: (param: any) => number;
  xAxisName?: string;
  yAxisName?: string;
}

export const EMPTY_SIMPLE_SCATTER_CONFIG: SimpleScatterConfig = {
  data: [],
  symbolSize: () => 25,
};

// Inv Histogram
export type InvHistogramData = {
  values: number[];
  rows: string[];
  visualMap?: {
    min: number;
    max: number;
    text: [string, string];
    colorRange?: string[];
  }
}
