import {Component, OnInit} from '@angular/core';
import * as d3 from 'd3';
import {Axis, ScaleBand, ScaleLinear} from "d3";

@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.scss']
})
export class BarchartComponent implements OnInit {
  readonly margin = {top: 40, bottom: 10, left: 120, right: 20};
  readonly width = 800 - this.margin.left - this.margin.right;
  readonly height = 600 - this.margin.top - this.margin.bottom;

// Creates sources <svg> element
  private svg?: d3.Selection<SVGSVGElement, any, HTMLElement, any>;

// Group used to enforce margin
  private g?: d3.Selection<SVGGElement, any, HTMLElement, any>;

// declare the data element type for proper typing


// Global variable for all data
  data: IElem[] = [
    {
      "temperature": 66.38,
      "location": {
        "city": "San Francisco",
        "country": "US"
      }
    },
    {
      "temperature": 21.51,
      "location": {
        "city": "Boston",
        "country": "US"
      }
    },
    {
      "temperature": 23.37,
      "location": {
        "city": "New York",
        "country": "US"
      }
    },
    {
      "temperature": 34.17,
      "location": {
        "city": "Tokyo",
        "country": "JP"
      }
    },
    {
      "temperature": 36.21,
      "location": {
        "city": "Washington, D. C.",
        "country": "US"
      }
    },
    {
      "temperature": 64.16,
      "location": {
        "city": "Los Angeles",
        "country": "US"
      }
    },
    {
      "temperature": 59.05,
      "location": {
        "city": "Mexico City",
        "country": "MX"
      }
    },
    {
      "temperature": 14.77,
      "location": {
        "city": "Seoul",
        "country": "KR"
      }
    },
    {
      "temperature": 28.93,
      "location": {
        "city": "Beijing",
        "country": "CN"
      }
    },
    {
      "temperature": 34.34,
      "location": {
        "city": "London",
        "country": "GB"
      }
    }
  ];
  private xscale?: ScaleLinear<number, number, never>;
  private yscale?: ScaleBand<string>;
  private xaxis?: Axis<number | { valueOf(): number }>;
  private yaxis?: Axis<string>;


  constructor() {
  }

  ngOnInit(): void {

    this.svg = d3
      .select("figure#bar-chart")
      .append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom);

    // Main Group
    this.g = this.svg!.append("g").attr("transform", `translate(${this.margin.left},${this.margin.top})`)
    // x axis content group inside main group
    this.g.append("g").attr(
      "class", "x-axis"
    );
    // y axis content group inside main group
    this.g.append("g").attr(
      "class", "y-axis"
    );

    // Scales setup
    this.xscale = d3.scaleLinear().range([0, this.width]);
    this.yscale = d3.scaleBand().rangeRound([0, this.height]).paddingInner(0.1);

// Axis setup
    this.xaxis = d3.axisTop(this.xscale);
    this.yaxis = d3.axisLeft(this.yscale);

    this.update();
  }

  update() {
    //update the scales
    // need to use the ! to tell TypeScript that it will always return a number
    this.xscale!.domain([0, d3.max(this.data, (d) => d.temperature)!]);
    this.yscale!.domain(this.data.map((d) => d.location.city));
    //render the axis
    // specify the generic argument to enforce being a SVGGElement
    this.g!.select<SVGGElement>(".x-axis").transition().call(this.xaxis!);
    this.g!.select<SVGGElement>(".y-axis").transition().call(this.yaxis!);

    // Render the chart with new data

    // DATA JOIN use the key argument for ensuring that the same DOM element is bound to the same data-item
    const rect = this.g!
      .selectAll("rect")
      .data(this.data, (d) => (d as IElem).location.city) // key argument cannot be properly typed
      .join(
        // ENTER
        // new elements
        (enter) => {
          const rect_enter = enter.append("rect").attr("x", 0);
          rect_enter.append("title");
          return rect_enter;
        },
        // UPDATE
        // update existing elements
        (update) => update,
        // EXIT
        // elements that aren't associated with data
        (exit) => exit.remove()
      );

    // ENTER + UPDATE
    // both old and new elements
    rect
      .transition()
      .attr("height", this.yscale!.bandwidth())
      .attr("width", (d) => this.xscale!(d.temperature)!)
      .attr("y", (d) => this.yscale!(d.location.city)!);

    rect.select("title").text((d) => d.location.city);
  }

}

export interface IElem {
  temperature: number;
  location: {
    country: string;
    city: string;
  };
}
