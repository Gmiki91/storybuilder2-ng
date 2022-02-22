import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  showFilter:boolean=false;
  constructor() { }

  ngOnInit(): void {
  }
  onFilterClicked(): void {
    this.showFilter=!this.showFilter;
  }

}
