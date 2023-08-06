import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as echarts from 'echarts';
import { isNil } from 'lodash';
import { EChartsOption, RadarData, RadarIndicator } from 'src/app/types/charts';

@Component({
  selector: 'app-radar',
  templateUrl: './radar.component.html',
  styleUrls: ['./radar.component.scss']
})
export class RadarComponent implements AfterViewInit, OnChanges {

  @Input() indicators: RadarIndicator[] = [];
  @Input() data: RadarData[] = [];
  @Input() id: string;

  private chart: echarts.ECharts | undefined;
  private option: EChartsOption;

  ngAfterViewInit() {
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.indicators = changes['indicators'].currentValue;
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
      color: '#FF0000',
      radar: {
        indicator: this.indicators
      },
      series: [
        {
          type: 'radar',
          data: this.data,
          areaStyle: {
            opacity: 0.25
          }
        }
      ]
    };
  }

}
