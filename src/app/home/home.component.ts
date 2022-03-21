import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom, Observable, of } from 'rxjs';
import { Story } from '../shared/models/story';
import { StoryService } from '../shared/services/story.service';
import { NewStoryComponent, NewStoryData } from '../forms/new-story/new-story.component';
import { PageService } from '../shared/services/page.service';
import { AuthenticationService } from '../shared/services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  storyList$!: Observable<Story[]>;
  tempStoryList$!: Observable<Story[]>;
  storyListWithPending$!: Observable<Story[]>
  loggedIn!: boolean;
  newStory: NewStoryData = {} as NewStoryData;
  error = false;
  constructor(
    private authService: AuthenticationService,
    private storyService: StoryService,
    private pageService: PageService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loggedIn = this.authService.isLoggedIn();
    this.storyList$ = this.storyService.getStoryList();
    if (this.loggedIn)
      this.storyListWithPending$ = this.storyService.getStoryListWithPendingPages();
    this.storyService.updateStoryList();
  }

  onNewStoryClicked(): void {
    const dialogRef = this.dialog.open(NewStoryComponent, {
      data: { story: this.newStory }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.addStory(result)
    }});
  }

  addStory(story: NewStoryData): void {
    lastValueFrom(this.pageService.addPage(story.text, story.language)).then((pageId: string) => {
      story.pageId = pageId;
      this.storyService.addStory(story);
      this.authService.refreshLoggedInUser();
    })
  }

  search(title: string): void {
    this.error = title.trim().length < 3 && title.trim().length !== 0;
    if (!this.error)
      this.storyService.changeSearchTitle(title);
  }

  togglePending(): void {
    if (this.storyListWithPending$ === this.storyList$) {
      this.storyList$ = this.tempStoryList$;
    } else {
      this.tempStoryList$ = this.storyList$;
      this.storyList$ = this.storyListWithPending$
    }
  }

}
