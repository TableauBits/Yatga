import { AfterViewInit, Component, Input, SimpleChanges } from '@angular/core';
import * as echarts from 'echarts';
import { isNil } from 'lodash';
import { EChartsOption, ScatterData } from 'src/app/types/charts';

const BUBBLE_SIZE = 6;

@Component({
  selector: 'app-scatter',
  templateUrl: './scatter.component.html',
  styleUrls: ['./scatter.component.scss']
})
export class ScatterComponent implements AfterViewInit {

  @Input() names: string[] = [];
  @Input() data: ScatterData[] = [];

  private chart: echarts.ECharts | undefined;
  private option: EChartsOption;

  ngAfterViewInit() {
    if (isNil(this.chart)) this.chart = echarts.init(document.getElementById('main')!);
    
    this.option = this.initChart();
    this.option && this.chart.setOption(this.option);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.names = changes['names'].currentValue;
    this.data = changes['data'].currentValue;
    this.ngAfterViewInit();
  }

  constructor() {
    this.chart = undefined;
    this.option = {};
  }

  private initChart(): EChartsOption {

    const title: echarts.TitleComponentOption[] = [];
    const singleAxis: echarts.SingleAxisComponentOption[] = [];
    const series: echarts.ScatterSeriesOption[] = [];

    this.names.forEach(function(name, idx) {
      title.push({
        textVerticalAlign: 'middle',
        top: ((idx + 0.5) * 100) / 7 + '%', // TODO : Nombres magique
        text: name
      });
      singleAxis.push({
        left: 150, // TODO : Nombres magique
        type: 'category',
        boundaryGap: false,
        data: [], //! HBFS
        top: (idx * 100) / 7 + 5 + '%',
        height: 100 / 7 - 10 + '%',
        axisLabel: {
          interval: 2
        }
      });
      series.push({
        singleAxisIndex: idx,
        coordinateSystem: 'singleAxis',
        type: 'scatter',
        data: [],
        symbolSize: function(dataItem) {
          return dataItem[1] * BUBBLE_SIZE;
        }
      });
    });

    this.data.forEach(function(dataItem) {
      (series as any)[dataItem[0]].data.push([dataItem[1], dataItem[2]]);
    });

    return {
      color: '#673AB7',
      tooltip: {
        position: 'top'
      },
      title: title,
      singleAxis: singleAxis,
      series: series
    };
  }


}