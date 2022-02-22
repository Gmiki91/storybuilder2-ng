import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Story } from '../models/story';
import { StoryService } from '../services/story.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  storyList$:Observable<Story[]>;
  constructor(private storyService: StoryService) {
    this.storyList$ = this.storyService.getStoryList();
    this.storyService.updateStoryList();
   }

  ngOnInit(): void {
   
  }

}
