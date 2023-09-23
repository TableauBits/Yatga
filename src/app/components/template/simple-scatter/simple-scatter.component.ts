import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { EChartsOption, color } from 'echarts';
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
    this.config = { data: [], symbolSize: 20 };
  }

  generateChartOption(): EChartsOption {
    return {
      tooltip: {
        formatter: '({c})',
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
          color: this.config.color
        }
      ]
    };
  }

}
