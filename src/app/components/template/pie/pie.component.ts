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
  @Input() id: string;

  private chart: echarts.ECharts | undefined;
  private option: EChartsOption;

  ngAfterViewInit() {
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.data = changes['data'].currentValue;
    this.ngAfterViewInit();
  }

  constructor() {
    this.id = "";
    this.chart = undefined;
    this.option = {};
  }

  private updateChart(): void {
    const element = document.getElementById(this.id);
    if (isNil(this.chart) && !isNil(element)) {
      this.chart = echarts.init(document.getElementById(this.id)!);
    }
    this.option = this.generateChartOption();
    this.option && this.chart?.setOption(this.option);
  }

  private generateChartOption(): EChartsOption {
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
