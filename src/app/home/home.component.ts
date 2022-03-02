import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Story } from '../shared/models/story';
import { StoryService } from '../shared/services/story.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  storyList$:Observable<Story[]>;

  constructor(private storyService: StoryService, private router: Router) {
    this.storyList$ = this.storyService.getStoryList();
    this.storyService.updateStoryList();
   }

  ngOnInit(): void {
   
  }
  onStoryClicked(story:Story): void {
    console.log(story.title);
    this.router.navigate(['/story'], {state:{story}})
  }

}
