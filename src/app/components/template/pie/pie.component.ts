// https://echarts.apache.org/examples/en/editor.html?c=pie-simple

import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EChartsOption } from 'echarts';
import * as echarts from 'echarts';
import { isNil } from 'lodash';
import { PieData } from 'src/app/types/charts';

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.scss']
})
export class PieComponent implements AfterViewInit, OnChanges {

  @Input() data: PieData[] = [];

  private chart: echarts.ECharts | undefined;
  private option: EChartsOption;

  ngAfterViewInit() {
    if (isNil(this.chart)) {
      this.chart = echarts.init(document.getElementById('pie')!);
    }
    
    this.option = this.initChart();
    this.option && this.chart.setOption(this.option);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.data = changes['data'].currentValue;
    this.ngAfterViewInit();
  }

  constructor() {
    this.chart = undefined;
    this.option = {};
  }

  private initChart(): EChartsOption {
    return {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        textStyle: {
          color: '#f4f4f4',
        }
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          data: this.data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0,0,0,0.5)'
            }
          },
          label: {
            color: '#f4f4f4',
          },
        }
      ]
    };
  }

}
