import { User } from "chelys";
import * as d3 from "d3"
import { HeatmapData } from "../charts";

export function buildHeatmap(div: string, users: User[], data: HeatmapData[]): void {
  // set dimensions and margins
  const bounds = (d3.select(div) as any).node().offsetWidth;
  const margin = { top: 50, right: 80, bottom: 100, left: 130 };

  const width = bounds - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  // create the svg area
  const svg = d3.select(div)
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",`translate(${margin.left},${margin.top})`)

  // rows & colomns labels
  const labels = users.map((u) => u.displayName);

  // build X scales and axis
  const x = d3.scaleBand()
    .range([ 0, width ])
    .domain(labels)
    .padding(0.01)
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .selectAll('text')
    .attr('transform', 'translate(-20,20)rotate(-45)')

  // Add X axis label:
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height+20 )
    .style("fill", "white")
    .text("Receveur")

  // build Y scales and axis:
  const y = d3.scaleBand()
    .range([ height, 0 ])
    .domain(labels)
    .padding(0.01)
  svg.append("g")
    .call(d3.axisLeft(y))
  
  // Add Y axis label:
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", -55)
    .attr("y", -10 )
    .style("fill", "white")
    .text("Donneur")
    .attr("text-anchor", "start")

  // build color scale
  const myColor = d3.scaleLinear(["white", "#673ab7"]).domain([0, 6])  // TODO : find max

  // add squares and interaction
  svg.selectAll()
  .data(data)
  .enter()
  .append("g")
    .attr("class", "square")
    .on('mouseenter', function() { rectSelect(this, x, y, labels) })
    .on('mouseleave', function() { rectUnselect(this) })
  .append("rect")
    .attr("x", function(d) {return x(labels[d[1]]) || 0})
    .attr("y", function(d) {return y(labels[d[0]]) || 0})
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth())
    .attr("rx", 10)
    .attr("ry", 10)
    .style("fill", function(d) { return myColor(d[2]) })
}

function rectSelect(element: SVGGElement, x: d3.ScaleBand<string>, y: d3.ScaleBand<string>, labels: string[]) {
  d3.select(element)
    .append("text")
    .attr('x', function(d) { return (x(labels[(d as HeatmapData)[1]]) || 0) + x.bandwidth() / 2 })
    .attr('y', function(d) { return (y(labels[(d as HeatmapData)[0]]) || 0) + y.bandwidth() / 2 })
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .text(function(d) {
      return (d as HeatmapData)[2]
    })
}

function rectUnselect(element: SVGGElement) {
  d3.select(element)
    .select('text')
    .remove()
}