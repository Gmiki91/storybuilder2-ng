import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Story } from 'src/app/shared/models/story';
import moment from 'moment';
@Component({
  selector: 'app-story-card',
  templateUrl: './story-card.component.html',
  styleUrls: ['../style.css']
})
export class StoryCardComponent implements OnInit {
  @Input() story!: Story;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.story.updatedAt = moment.utc(this.story.updatedAt).local().startOf('seconds').fromNow()
  }
  onStoryClicked(): void {
    this.router.navigate(['/story'], { state: { storyId:this.story._id } })
  }
 
}
