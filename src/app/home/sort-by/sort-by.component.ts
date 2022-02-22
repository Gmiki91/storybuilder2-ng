import { Component, OnInit } from '@angular/core';
import { StoryService } from 'src/app/services/story.service';

@Component({
  selector: 'app-sort-by',
  templateUrl: './sort-by.component.html',
  styleUrls: ['./sort-by.component.css']
})
export class SortByComponent implements OnInit {

  constructor(private storyService: StoryService) { }

  ngOnInit(): void {
  }
  changeDirection(): void {
    this.storyService.changeSortDirection();
  }
}
