import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as echarts from 'echarts';
import { isNil } from 'lodash';

type EChartsOption = echarts.EChartsOption;

const GRADE_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

@Component({
  selector: 'app-histogram',
  templateUrl: './histogram.component.html',
  styleUrls: ['./histogram.component.scss']
})
export class HistogramComponent implements AfterViewInit, OnChanges {

  @Input() values: number[] = [];

  private chart: echarts.ECharts | undefined;
  private option: EChartsOption;

  ngAfterViewInit() {
    if (isNil(this.chart)) this.chart = echarts.init(document.getElementById('main')!);
    
    this.option = this.initChart();
    this.option && this.chart.setOption(this.option);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.values = changes['values'].currentValue;
    this.ngAfterViewInit();
  }

  constructor() {
    this.chart = undefined;
    this.option = {};
  }

  private initChart(): EChartsOption {
    const counts: number[] = [];
    GRADE_VALUES.forEach((grade) => {
      counts.push(this.countGrade(grade));
    })

    return {
      color: '#673AB7',
      series: [
        {
          data: counts,
          type: 'bar'
        }
      ],
      xAxis: {
        type: 'category',
        data: GRADE_VALUES
      },
      yAxis: {
        type: 'value'
      }
    }
  }

  private countGrade(grade: number): number {
    return this.values.filter(value => value === grade).length;
  }

}
