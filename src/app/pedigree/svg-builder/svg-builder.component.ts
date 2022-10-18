import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import * as d3 from 'd3';
import {HierarchyNode, HierarchyPointLink, HierarchyPointNode, tree, ZoomTransform} from "d3";

@Component({
  selector: 'app-svg-builder',
  templateUrl: './svg-builder.component.svg',
  styleUrls: ['./svg-builder.component.scss']
})
export class SvgBuilderComponent implements OnInit, AfterViewInit {

  readonly dx = 600;
  dy?: number;
  width: number = 600;
  height: number = 600;
  readonly margin = ({top: 10, right: 120, bottom: 10, left: 40});
  readonly memberBox = {
    width: 205,
    height: 65,
    marginHeight: 180,
    marginWidth: 50
  };

  readonly tree = d3.tree<PedigreeHierarchy>()
    .nodeSize([
      this.memberBox.height + this.memberBox.marginHeight,
      this.memberBox.width + this.memberBox.marginWidth
    ])
    .separation(() => 0.5)
  ;

  @Input('hierarchy')
  root?: d3.HierarchyNode<PedigreeHierarchy>;

  nodes?: HierarchyPointNode<PedigreeHierarchy>;

  data?: HierarchyPointNode<PedigreeHierarchy>[];
  links?: d3.HierarchyPointLink<PedigreeHierarchy>[];

  @ViewChild('pedigreesvg', {static: true})
  pedigreesvgElement?: ElementRef;

  left?: HierarchyPointNode<PedigreeHierarchy>;
  right?: HierarchyPointNode<PedigreeHierarchy>;
  zoomTransform?: ZoomTransform;

  constructor() {
  }

  ngAfterViewInit() {
    const zoom = d3.zoom()
      .scaleExtent([0.5, 2])
      .on("zoom", () => this.onZoom());
    d3.select(this.pedigreesvgElement!.nativeElement)
      .call(zoom);
  }

  onZoom() {
     this.zoomTransform = d3.zoomTransform(this.pedigreesvgElement!.nativeElement);
  }

  ngOnInit(): void {
    this.dy = this.width / 6;

    this.nodes = this.tree(this.root!);

    this.left = this.nodes!;
    this.right = this.nodes!;
    this.nodes.eachBefore(node => {
      if (node.x < this.left!.x) {
        this.left = node;
      }
      if (node.x > this.right!.x) {
        this.right = node;
      }
    });

    let height = this.right.x - this.left.x + this.margin.top + this.margin.bottom;
    height = Math.max(height, 320);

    this.data = this.nodes.descendants().reverse();
    this.links = this.nodes.links().reverse();
  }

  public buildLinkPath(d: HierarchyPointLink<any>) {
    let path: string = "";
    const o = {x: d.source.x, y: d.source.y};
    path += this.transitionElbow({source: o});
    path += this.elbow(d);
    path += this.transitionElbow({source: o});

    return path;
  }

  private transitionElbow(d: { source: { y: number; x: number; }; } | HierarchyPointLink<any>) {
    return 'M' + d.source.y + ',' + d.source.x
      + 'H' + d.source.y
      + 'V' + d.source.x
      + 'H' + d.source.y;
  }

  private elbow(d: HierarchyPointLink<any>) {
    const memberBox = {
      width: 205,
      height: 65,
      marginHeight: 180,
      marginWidth: 50
    };

    // start point x1, y1
    const x1 = d.source.y + (1 * memberBox.width / 2);
    const y1 = d.source.x;
    // endpoint x4, y4
    const x4 = d.target.y - (1 * memberBox.width / 2);
    const y4 = d.target.x;

    const x2 = x1 + (x4 - x1) / 2;
    const y2 = y1;

    const x3 = x2;
    const y3 = y4;

    return `M${x1},${y1}H${x2}V${y2 + (y3 - y2)}H${x4}`;
  }

}

export interface PedigreeHierarchy {
  name: string;
  parents?: PedigreeHierarchy[];
}
