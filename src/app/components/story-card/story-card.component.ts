import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Story } from 'src/app/shared/models/story';

@Component({
  selector: 'app-story-card',
  templateUrl: './story-card.component.html',
  styleUrls: ['../style.css']
})
export class StoryCardComponent implements OnInit {
  @Input() story!: Story;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  onStoryClicked(): void {
    this.router.navigate(['/story'], { state: { storyId:this.story._id } })
  }
  onAuthor(event:MouseEvent):void{
    event.stopPropagation();
    this.router.navigate(['/stats'], { state: { authorId:this.story.authorId } })
  }
}
