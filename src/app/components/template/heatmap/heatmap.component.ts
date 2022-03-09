import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as echarts from 'echarts';
import { isNil } from 'lodash';
import { EChartsOption, HeatmapData } from 'src/app/types/charts';

@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.scss']
})
export class HeatmapComponent implements AfterViewInit, OnChanges  {

  @Input() data: HeatmapData[] = [];
  @Input() xAxis: string[] = [];
  @Input() yAxis: string[] = [];

  private max = -1;

  private chart: echarts.ECharts | undefined;
  private option: EChartsOption;

  ngAfterViewInit() {
    if (isNil(this.chart)) this.chart = echarts.init(document.getElementById('heatmap')!);
    
    this.option = this.initChart();
    this.option && this.chart.setOption(this.option);
  }

  ngOnChanges(changes: SimpleChanges) {
    let max = -1;
    this.data = changes['data'].currentValue.map(function (item: HeatmapData) {
      if (item[2] > max) max = item[2];
      return [item[1], item[0], item[2] || '-'];
    });
    this.max = max;
    this.xAxis = changes['xAxis'].currentValue;
    this.yAxis = changes['yAxis'].currentValue;
    this.ngAfterViewInit();
  }

  constructor() {
    this.chart = undefined;
    this.option = {};
  }

  private initChart(): EChartsOption {
    return {
      tooltip: {
        position: 'top'
      },
      grid: {
        height: '50%',
        top: '10%'
      },
      xAxis: {
        type: 'category',
        data: this.xAxis,
        splitArea: {
          show: true
        }
      },
      yAxis: {
        type: 'category',
        data: this.yAxis,
        splitArea: {
          show: true
        }
      },
      visualMap: {
        min: 0,
        max: this.max,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '15%'
      },
      series: [
        {
          name: 'Punch Card',
          type: 'heatmap',
          data: this.data,
          label: {
            show: true
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }

}
