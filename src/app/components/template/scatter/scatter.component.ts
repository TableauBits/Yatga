import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as echarts from 'echarts';
import { isNil, range } from 'lodash';
import { Charts, EChartsOption, ScatterConfig } from 'src/app/types/charts';

@Component({
  selector: 'app-scatter',
  templateUrl: './scatter.component.html',
  styleUrls: ['./scatter.component.scss']
})
export class ScatterComponent extends Charts implements AfterViewInit, OnChanges {

  @Input() config: ScatterConfig;
  @Input() id: string;

  ngAfterViewInit() {
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) this.config = changes['config'].currentValue;
    this.updateChart();
  }

  constructor() {
    super();
    this.id = "";
    this.config =  { axisMax: 100, symbolSize: () => 15, data: [], names: [] };
  }

  generateChartOption(): EChartsOption {
    const title: echarts.TitleComponentOption[] = [];
    const singleAxis: echarts.SingleAxisComponentOption[] = [];
    const series: echarts.ScatterSeriesOption[] = [];
    const array: number[] = range(1, this.config.axisMax+1);

    const numberOfUsers = this.config.names.length;
    const {axisLabelInterval, symbolSize, color, formatter} = this.config;

    this.config.names.forEach(function(name, idx) {
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
          interval: axisLabelInterval
        }
      });
      series.push({
        singleAxisIndex: idx,
        coordinateSystem: 'singleAxis',
        type: 'scatter',
        data: [],
        color: color,
        symbolSize: symbolSize,
        // symbolSize: function(dataItem) {
        //   return dataItem[1] * bubbleSizeMultiplier;
        // }
      });
    });

    this.config.data.forEach(function(dataItem) {
      if (isNil((series as any)[dataItem[0]])) return;
      (series as any)[dataItem[0]].data.push([dataItem[1], dataItem[2]]);
    });

    return {
      tooltip: {
        position: 'top',
        formatter: formatter,
      },
      title: title,
      singleAxis: singleAxis,
      series: series
    };
  }

}
