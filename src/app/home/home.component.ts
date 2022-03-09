import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Story } from '../shared/models/story';
import { StoryService } from '../shared/services/story.service';
import { NewStoryComponent, StoryData } from '../forms/new-story/new-story.component';
import { PageService } from '../shared/services/page.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  storyList$!: Observable<Story[]>;
  newStory: StoryData = {} as StoryData;
  constructor(
    private storyService: StoryService,
    private pageService: PageService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.storyList$ = this.storyService.getStoryList();
    this.storyService.updateStoryList();
  }
  onStoryClicked(story: Story): void {
    this.router.navigate(['/story'], { state: { story } })
  }

  onNewStoryClicked(): void {
    const dialogRef = this.dialog.open(NewStoryComponent, {
      data: { story: this.newStory }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.addStory(result)
      }
    });
  }

   addStory(story: StoryData):void {
    this.pageService.addPage(story.text, story.language).subscribe((pageId:string)=>{
      story.pageId = pageId;
      this.storyService.addStory(story)
    })
    
  }

}
