import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EChartsOption } from 'echarts';
import { Charts, RingGaugeData } from 'src/app/types/charts';

@Component({
  selector: 'app-ring-gauge',
  templateUrl: './ring-gauge.component.html',
  styleUrls: ['./ring-gauge.component.scss']
})
export class RingGaugeComponent extends Charts implements AfterViewInit, OnChanges {

  @Input() data: RingGaugeData[] = [];
  @Input() id: string;

  ngAfterViewInit() {
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.data = changes['data'].currentValue;
    this.ngAfterViewInit();
  }

  constructor() {
    super();
    this.id = "";
  }

  generateChartOption(): EChartsOption {
    return {
      series: [
        {
          type: 'gauge',
          startAngle: 90,
          endAngle: -270,
          pointer: {
            show: false,
          }, progress: {
            show: true,
            overlap: false,
            roundCap: true,
            clip: false,
            itemStyle: {
              borderWidth: 1,
              borderColor: '#464646'
            }
          },
          axisLine: {
            lineStyle: {
              width: 40
            }
          },
          splitLine: {
            show: false,
            distance: 0,
            length: 10
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false,
            distance: 50
          },
          data: this.data,
          title: {
            fontSize: 14
          },
          detail: {
            width: 50,
            height: 14,
            fontSize: 14,
            color: 'inherit',
            borderColor: 'inherit',
            borderRadius: 20,
            borderWidth: 1,
            formatter: '{value}%'
          }
        }
      ]
    };
  }

}
