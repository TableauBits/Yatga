import * as echarts from 'echarts';
import { isNil } from 'lodash';

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
      this.chart = echarts.init(element!);
    }
    this.option = this.generateChartOption();
    this.option && this.chart?.setOption(this.option);
  }
  
  abstract generateChartOption(): EChartsOption;
}

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
export type ScatterData = [
  number, // Axis Id
  number, // Position
  number  // Size
];
