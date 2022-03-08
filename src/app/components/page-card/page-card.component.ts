import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-card',
  templateUrl: './page-card.component.html',
  styleUrls: ['../style.css']
})
export class PageCardComponent implements OnInit {

  @Input() text!:string;
  @Input() author!:string;
  constructor() { }

  ngOnInit(): void {
  }

}
