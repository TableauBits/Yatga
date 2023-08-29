import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Charts, EChartsOption, HeatmapData } from 'src/app/types/charts';

@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.scss']
})
export class HeatmapComponent extends Charts implements AfterViewInit, OnChanges  {

  @Input() data: HeatmapData[] = [];
  @Input() xAxis: string[] = [];
  @Input() yAxis: string[] = [];
  @Input() id: string;

  private max = -1;

  ngAfterViewInit() {
    this.updateChart();
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
    this.updateChart();
  }

  constructor() {
    super();
    this.id = "";
  }

  generateChartOption(): EChartsOption {
    const xAxis = this.xAxis;
    const yAxis = this.yAxis;
    return {
      tooltip: {
        formatter: function (p) {
          const userX = xAxis[(p as any).data[1]];
          const userY = yAxis[(p as any).data[0]];
          const value = (p as any).data[2];
          return `${userX} vers ${userY} : ${value}`;
        }
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
        bottom: '15%',
        textStyle:  {
          color: '#f4f4f4'
        }
      },
      series: [
        {
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
