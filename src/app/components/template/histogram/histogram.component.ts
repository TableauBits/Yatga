import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as echarts from 'echarts';
import { isNil } from 'lodash';
import { EChartsOption } from 'src/app/types/charts';

const GRADE_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // TODO : give the values to count with Input

@Component({
  selector: 'app-histogram',
  templateUrl: './histogram.component.html',
  styleUrls: ['./histogram.component.scss']
})
export class HistogramComponent implements AfterViewInit, OnChanges {

  @Input() values: number[] = [];
  @Input() id: string;

  private chart: echarts.ECharts | undefined;
  private option: EChartsOption;

  ngAfterViewInit() {
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.values = changes['values'].currentValue;
    this.updateChart();
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
    };
  }

  private count(grade: number): number {
    return this.values.filter(value => value === grade).length;
  }

}
