import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as echarts from 'echarts';
import { isNil } from 'lodash';
import { EChartsOption } from 'echarts';
import { ChordCategory, ChordLink, ChordNode } from 'src/app/types/charts';

@Component({
  selector: 'app-chord',
  templateUrl: './chord.component.html',
  styleUrls: ['./chord.component.scss']
})
export class ChordComponent implements AfterViewInit, OnChanges {

  @Input() categories: ChordCategory[] = [];
  @Input() links: ChordLink[] = [];
  @Input() nodes: ChordNode[] = [];

  private chart: echarts.ECharts | undefined;
  private option: EChartsOption;

  ngAfterViewInit() {
    if (isNil(this.chart)) this.chart = echarts.init(document.getElementById('chord')!);
    
    this.option = this.initChart();
    this.option && this.chart.setOption(this.option);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.categories = changes['categories'].currentValue;
    this.links = changes['links'].currentValue;
    this.nodes = changes['nodes'].currentValue;
    this.ngAfterViewInit();
  }

  constructor() {
    this.chart = undefined;
    this.option = {};
  }

  private initChart(): EChartsOption {
    // return {
    //   tooltip: {},
    //   // legend: [
    //   //   {
    //   //     data: this.categories.map(function (a: { name: string }) {
    //   //       return a.name;
    //   //     }),
    //   //     orient: 'vertical',
    //   //     left: 'left',
    //   //     textStyle: {
    //   //       color: '#f4f4f4',
    //   //     }
    //   //   }
    //   // ],
    //   animationDurationUpdate: 1500,
    //   animationEasingUpdate: 'quinticInOut',
    //   series: [
    //     {
    //       type: 'graph',
    //       layout: 'circular',
    //       circular: {
    //         rotateLabel: true
    //       },
    //       data: this.nodes,
    //       links: this.links,
    //       roam: true,
    //       label: {
    //         position: 'right',
    //         formatter: '{b}'
    //       },
    //       lineStyle: {
    //         color: 'source',
    //         curveness: 0.3,
    //         width: 3
    //       }
    //     }
    //   ]
    // };

    return {
      tooltip: {},
      legend: [
        {
          data: this.categories.map(function (a) {
            return a.name;
          }),
          orient: 'vertical',
          left: 'left',
          textStyle: {
            color: '#f4f4f4',
          }
        }
      ],
      series: [
        {
          // name: 'Les Miserables',
          type: 'graph',
          layout: 'force',
          data: this.nodes,
          links: this.links,
          categories: this.categories,
          roam: true,
          label: {
            show: true,
            position: 'right',
            formatter: '{b}',
            color: '#f4f4f4'
          },
          labelLayout: {
            hideOverlap: true
          },
          scaleLimit: {
            min: 0.4,
            max: 2
          },
          lineStyle: {
            color: 'source'
          },
          // force: {
             // repulsion: 10
          // }
        }
      ]
    };
  }


}
