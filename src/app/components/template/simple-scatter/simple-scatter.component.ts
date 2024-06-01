import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EChartsOption } from 'echarts';
import { Charts, SimpleScatterConfig } from 'src/app/types/charts';

@Component({
  selector: 'app-simple-scatter',
  templateUrl: './simple-scatter.component.html',
  styleUrls: ['./simple-scatter.component.scss']
})
export class SimpleScatterComponent extends Charts implements AfterViewInit, OnChanges {

  @Input() id: string;
  @Input() config: SimpleScatterConfig;

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
    this.config = { data: [], symbolSize: () => 25 };
  }

  generateChartOption(): EChartsOption {
    return {
      tooltip: {
        formatter: this.config.formatter,
      },
      xAxis: {
        name: this.config.xAxisName,
        nameTextStyle: {
          fontStyle: "italic"
        },
        axisLine: {
          lineStyle: {
            width: 2
          }
        }
      },
      yAxis: {
        name: this.config.yAxisName,
        nameTextStyle: {
          fontStyle: "italic"
        },
        axisLine: {
          lineStyle: {
            width: 2
          }
        }
      },
      series: [
        {
          type: 'scatter',
          symbolSize: this.config.symbolSize,
          data: this.config.data,
          color: this.config.color,
          emphasis: {
            focus: 'self'
          },
          markArea: {
            silent: true,
            itemStyle: {
              color: 'rgba(255, 0, 0, 0.10)', // Change this to the color you want
            },
            data: [
              [
                {
                  xAxis: '-Infinity',
                  yAxis: 0
                },
                {
                  xAxis: 0,
                  yAxis: 'Infinity'
                },
              ],
              [
                // Second area : for y negative and x positive
                {
                  xAxis: 0,
                  yAxis: '-Infinity'
                },
                {
                  xAxis: 'Infinity',
                  yAxis: 0
                },
              ],
            ],
          },
        }
      ]
    };
  }

}
