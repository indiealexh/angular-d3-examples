import {Component, Input, OnInit} from '@angular/core';
import * as d3 from 'd3';
import {DefaultLinkObject, hierarchy, Link} from "d3";
import {PedigreeHierarchy} from "./svg-builder/svg-builder.component";


@Component({
  selector: 'app-pedigree',
  templateUrl: './pedigree.component.html',
  styleUrls: ['./pedigree.component.scss']
})
export class PedigreeComponent implements OnInit {

  pedigreeHierarchy: PedigreeHierarchy = {
    name: "33333",
    parents: [
      {
        name: "22222",
        parents: [
          {
            name: "00111"
          },
          {
            name: "00112"
          }
        ]
      },
      {
        name: "11111",
        parents: [
          {
            name: "00113"
          },
          {
            name: "00452"
          }
        ]
      }
    ]
  };

  hierarchy?: d3.HierarchyNode<PedigreeHierarchy>;

  constructor() {


  }

  ngOnInit() {
    this.hierarchy = d3.hierarchy(this.pedigreeHierarchy, (subject) => {
      return subject.parents;
    });
  }

}


