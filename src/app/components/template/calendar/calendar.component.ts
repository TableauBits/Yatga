import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EChartsOption } from 'echarts';
import { max, min } from 'lodash';
import { CalendarData, Charts } from 'src/app/types/charts';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent extends Charts implements AfterViewInit, OnChanges {

  @Input() id: string;
  @Input() data: CalendarData[] = [];

  ngAfterViewInit() {
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) this.data = changes['data'].currentValue;
    this.ngAfterViewInit();
  }

  constructor() {
    super();
    this.id = "";
  }

  generateChartOption(): EChartsOption {
    const sort = this.data.map(d => d[0]).sort();
    return {
      tooltip: {
        formatter: function (p) {
          return `${(p as any).data[1]} chansons ajoutées le ${(p as any).data[0]}`;
        },
      },
      visualMap: {
        show: false,
      },
      calendar: {
        range: [sort[0], sort.reverse()[0]],
        dayLabel: {
          color: "#f4f4f4"
        },
        monthLabel: {
          color: "#f4f4f4"
        }
      },
      series: {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: this.data
      }
    };
  }

}
