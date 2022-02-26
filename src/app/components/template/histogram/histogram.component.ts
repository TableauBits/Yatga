import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as echarts from 'echarts';
import { isNil } from 'lodash';
import { CHARTS_ID_LENGTH, EChartsOption } from 'src/app/types/charts';
import { generateRandomString } from 'src/app/types/utils';

const GRADE_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // TODO : give the values to count with Input

@Component({
  selector: 'app-histogram',
  templateUrl: './histogram.component.html',
  styleUrls: ['./histogram.component.scss']
})
export class HistogramComponent implements AfterViewInit, OnInit, OnChanges {

  @Input() values: number[] = [];

  // id: string = generateRandomString(CHARTS_ID_LENGTH);

  private chart: echarts.ECharts | undefined;
  private option: EChartsOption;
  

  // TODO : Generate a random id string

  ngAfterViewInit() {
    if (isNil(this.chart)) {
      this.chart = echarts.init(document.getElementById('histogram')!);      
    } 
    
    this.option = this.initChart();
    this.option && this.chart.setOption(this.option);
  }

  ngOnInit(): void {
    // this.id = generateRandomString(CHARTS_ID_LENGTH);
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
    return {
      tooltip: {
        trigger: 'item'
      },
      color: '#673AB7',
      series: [
        {
          data: GRADE_VALUES.map((grade) => this.count(grade)),
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

  private count(grade: number): number {
    return this.values.filter(value => value === grade).length;
  }

}
