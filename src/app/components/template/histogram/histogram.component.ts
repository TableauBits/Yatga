import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Charts, EChartsOption } from 'src/app/types/charts';

const GRADE_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // TODO : give the values to count with Input

@Component({
  selector: 'app-histogram',
  templateUrl: './histogram.component.html',
  styleUrls: ['./histogram.component.scss']
})
export class HistogramComponent extends Charts implements AfterViewInit, OnChanges {

  @Input() values: number[] = [];
  @Input() id: string;

  ngAfterViewInit() {
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.values = changes['values'].currentValue;
    this.updateChart();
  }

  constructor() { 
    super();
    this.id = "";
  }

  generateChartOption(): EChartsOption {
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
