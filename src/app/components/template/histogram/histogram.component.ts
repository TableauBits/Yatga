import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Charts, EChartsOption } from 'src/app/types/charts';

@Component({
  selector: 'app-histogram',
  templateUrl: './histogram.component.html',
  styleUrls: ['./histogram.component.scss']
})
export class HistogramComponent extends Charts implements AfterViewInit, OnChanges {

  @Input() values: number[] = [];
  @Input() columns: number[] = [];
  @Input() id: string;

  ngAfterViewInit() {
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    let needUpdate = false;

    if (changes['values']) {
      this.values = changes['values'].currentValue;
      needUpdate = true;
    } 
    if (changes['columns']) {
      if (changes['columns'].currentValue.length !== this.columns.length) {
        this.columns = changes['columns'].currentValue;
        needUpdate = true;
      }
    }

    if (needUpdate) this.updateChart();
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
          data: this.columns.map((column) => this.count(column)),
          type: 'bar',
          barWidth: '60%',
        }
      ],
      xAxis: {
        type: 'category',
        data: this.columns
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
