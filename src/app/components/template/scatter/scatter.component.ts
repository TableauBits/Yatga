import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as echarts from 'echarts';
import { isNil, range } from 'lodash';
import { Charts, EChartsOption, ScatterData } from 'src/app/types/charts';

const BUBBLE_SIZE = 30;

@Component({
  selector: 'app-scatter',
  templateUrl: './scatter.component.html',
  styleUrls: ['./scatter.component.scss']
})
export class ScatterComponent extends Charts implements AfterViewInit, OnChanges {

  @Input() names: string[] = [];
  @Input() data: ScatterData[] = [];
  @Input() axisMax: number = 100;
  @Input() axisLabelInterval?: number;
  @Input() id: string;

  ngAfterViewInit() {
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.names = changes['names'].currentValue;
    this.data = changes['data'].currentValue;
    this.updateChart();
  }

  constructor() {
    super();
    this.id = "";
  }

  generateChartOption(): EChartsOption {
    const title: echarts.TitleComponentOption[] = [];
    const singleAxis: echarts.SingleAxisComponentOption[] = [];
    const series: echarts.ScatterSeriesOption[] = [];
    const array: number[] = range(1, this.axisMax+1);
    const numberOfUsers = this.names.length;
    const interval = this.axisLabelInterval;

    this.names.forEach(function(name, idx) {
      title.push({
        top: ((idx + 0.5) * 100) / numberOfUsers + '%', // TODO : Nombres magique
        text: name,
        textStyle: {
          fontSize: 15,
          color: '#f4f4f4'
        },
      });
      singleAxis.push({
        left: 200, // TODO : Nombres magique
        type: 'category',
        boundaryGap: false,
        data: array,
        top: (idx * 100) / numberOfUsers + 5 + '%',
        height: 100 / numberOfUsers - 10 + '%',
        axisLabel: {
          interval: interval
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
      if (isNil((series as any)[dataItem[0]])) return;
      (series as any)[dataItem[0]].data.push([dataItem[1], dataItem[2]]);
    });

    return {
      tooltip: {
        position: 'top'
      },
      title: title,
      singleAxis: singleAxis,
      series: series
    };
  }

}
