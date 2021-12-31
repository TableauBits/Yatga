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

  private chart: echarts.ECharts | undefined;
  private option: EChartsOption;

  ngAfterViewInit() {
    if (isNil(this.chart)) this.chart = echarts.init(document.getElementById('main')!);
    
    this.option = this.initChart();
    this.option && this.chart.setOption(this.option);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.indicators = changes['indicators'].currentValue;
    this.data = changes['data'].currentValue;
    this.ngAfterViewInit();
  }

  constructor() {
    this.chart = undefined;
    this.option = {};
  }

  private initChart(): EChartsOption {
    return {
      // TODO : Legend ?
      color: '#673AB7',
      radar: {
        indicator: this.indicators
      },
      series: [
        {
          type: 'radar',
          data: this.data
        }
      ]
    }
  }

}
