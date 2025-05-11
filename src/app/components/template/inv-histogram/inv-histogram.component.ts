import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EChartsOption } from 'echarts';
import { Charts, InvHistogramData } from 'src/app/types/charts';

@Component({
  selector: 'app-inv-histogram',
  templateUrl: './inv-histogram.component.html',
  styleUrls: ['./inv-histogram.component.scss']
})
export class InvHistogramComponent extends Charts implements AfterViewInit, OnChanges {
  @Input() data: InvHistogramData;
  @Input() id: string;
  @Input() width: string = '100%';
  @Input() height: string = '500%';

  ngAfterViewInit() {
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.data = changes['data'].currentValue;
    this.updateChart();
  }

  constructor() {
    super();
    this.id = "";
    this.data = {
      rows: [],
      values: []
    };
  }

  getStyle() {
    return `width:${this.width}; height:${this.height};`;
  }

  generateChartOption(): EChartsOption {
    // const colors = [
    //   "#759aa0",
    //   "#dd6b66",
    //   "#e69d87",
    //   "#8dc1a9",
    //   "#eedd78",
    //   "#ea7e53",
    //   "#73a373",
    //   "#73b9bc",
    //   "#7289ab",
    //   "#91ca8c",
    //   "#f49f42"
    // ].reverse(); // Define your colors here

    return {
      tooltip: {
        trigger: 'item'
      },
      visualMap: {
        orient: 'horizontal',
        left: 'center',
        min: this.data.visualMap?.min,
        max: this.data.visualMap?.max,
        text: this.data.visualMap?.text,
        // Map the score column to color
        dimension: 0,
        inRange: {
          color: this.data.visualMap?.colorRange ?? ['#D1C4E9', '#673AB7', '#311B92']
        },
        textStyle: {
          color: '#fff',
          fontWeight: 'bold'
        }
      },
      series: [
        {
          data: this.data.values,
          // data: this.data.values.map((value, index) => ({ value, itemStyle: { color: colors[index % colors.length] } })),
          type: 'bar',
          barWidth: '60%',
        }
      ],
      xAxis: {
        type: 'value',
      },
      yAxis: {
        type: 'category',
        data: this.data.rows,
        axisLabel: {
          fontWeight: 'bold',
          fontSize: 14
        }
      }
    };
  }

}

