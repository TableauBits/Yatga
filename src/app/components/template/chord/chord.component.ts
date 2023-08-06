import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EChartsOption } from 'echarts';
import { Charts, ChordCategory, ChordLink, ChordNode } from 'src/app/types/charts';

@Component({
  selector: 'app-chord',
  templateUrl: './chord.component.html',
  styleUrls: ['./chord.component.scss']
})
export class ChordComponent extends Charts implements AfterViewInit, OnChanges {

  @Input() categories: ChordCategory[] = [];
  @Input() links: ChordLink[] = [];
  @Input() nodes: ChordNode[] = [];
  @Input() useForce: boolean = false;
  @Input() id: string;

  ngAfterViewInit() {
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['categories']) this.categories = changes['categories'].currentValue;
    if (changes['links']) this.links = changes['links'].currentValue;
    if (changes['nodes']) this.nodes = changes['nodes'].currentValue;
    if (changes['useForce']) this.useForce = changes['useForce'].currentValue;
    
    this.ngAfterViewInit();
  }

  constructor() {
    super();
    this.id = "";
  }

  generateChartOption(): EChartsOption {
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
          }
        }
      ]
    };
  }


}
