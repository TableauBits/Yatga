import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Charts, EChartsOption, RadarData, RadarIndicator } from 'src/app/types/charts';

@Component({
  selector: 'app-radar',
  templateUrl: './radar.component.html',
  styleUrls: ['./radar.component.scss']
})
export class RadarComponent extends Charts implements AfterViewInit, OnChanges {

  @Input() indicators: RadarIndicator[] = [];
  @Input() data: RadarData[] = [];
  @Input() id: string;

  ngAfterViewInit() {
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.indicators = changes['indicators'].currentValue;
    this.data = changes['data'].currentValue;
    this.ngAfterViewInit();
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
