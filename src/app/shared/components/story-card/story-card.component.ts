import { Component, Input, OnInit } from '@angular/core';
import { Story } from 'src/app/shared/models/story';

@Component({
  selector: 'app-story-card',
  templateUrl: './story-card.component.html',
  styleUrls: ['./story-card.component.css']
})
export class StoryCardComponent implements OnInit {
  @Input() story!: Story;

  constructor() { }

  ngOnInit(): void {
  }

}
