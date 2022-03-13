import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {

  @Input() hoursLeft!:number;
  @Input() minutesLeft!:number;
  @Input() text!:string;

  constructor() { }

  ngOnInit(): void {
  }

}
