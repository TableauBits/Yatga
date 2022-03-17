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
  @Input() useForce: boolean = false;

  private chart: echarts.ECharts | undefined;
  private option: EChartsOption;

  ngAfterViewInit() {
    if (isNil(this.chart)) this.chart = echarts.init(document.getElementById('chord')!);
    
    this.option = this.initChart();
    this.option && this.chart.setOption(this.option);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['categories']) this.categories = changes['categories'].currentValue;
    if (changes['links']) this.links = changes['links'].currentValue;
    if (changes['nodes']) this.nodes = changes['nodes'].currentValue;
    if (changes['useForce']) this.useForce = changes['useForce'].currentValue;
    
    this.ngAfterViewInit();
  }

  constructor() {
    this.chart = undefined;
    this.option = {};
  }

  private initChart(): EChartsOption {
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
          type: 'graph',
          layout: this.useForce ? 'force' : 'none',
          data: this.nodes,
          edges: this.links,
          categories: this.categories,
          // roam: true,
          draggable: true,
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
          force: {
            // repulsion: 50,
            // edgeLength: 5,
            // repulsion: 20,
            // gravity: 0.2
          }
        }
      ]
    };
  }


}
