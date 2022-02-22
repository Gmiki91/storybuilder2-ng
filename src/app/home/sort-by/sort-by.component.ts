import { Component, OnInit } from '@angular/core';
import { Sort, StoryService } from 'src/app/services/story.service';

@Component({
  selector: 'app-sort-by',
  templateUrl: './sort-by.component.html',
  styleUrls: ['./sort-by.component.css']
})
export class SortByComponent implements OnInit {
  currentSort!:Sort;
  
  constructor(private storyService: StoryService) {}

  ngOnInit(): void {}
  onClick(value:Sort): void {
    this.currentSort=value;
    this.storyService.changeSort(value);
  }
}
