import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom, Observable, Subscription } from 'rxjs';
import { Story } from '../shared/models/story';
import { StoryService } from '../shared/services/story.service';
import { NewStoryComponent, NewStoryData } from '../forms/new-story/new-story.component';
import { PageService } from '../shared/services/page.service';
import { AuthenticationService } from '../shared/services/authentication.service';
import { NoteService } from '../shared/services/note.service';
import { Note } from '../shared/models/note';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  subscription: Subscription= new Subscription();
  storyList$!: Observable<Story[]>;
  tempStoryList$!: Observable<Story[]>;
  storyListWithPending$!: Observable<Story[]>
  favoriteIds:string[] = [];
  loggedIn!: boolean;
  newStory: NewStoryData = {} as NewStoryData;
  error = false;
  showFilter=false;
  constructor(
    private authService: AuthenticationService,
    private storyService: StoryService,
    private pageService: PageService,
    private noteService: NoteService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    const observable$=this.authService.getFavoriteIds().subscribe(favoriteIds=>this.favoriteIds=favoriteIds);
    this.subscription.add(observable$);
    this.loggedIn = this.authService.isLoggedIn();
    this.storyList$ = this.storyService.getStoryList();
    if (this.loggedIn)
      this.storyListWithPending$ = this.storyService.getStoryListWithPendingPages();
    this.storyService.updateStoryList();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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

  async addStory(story: NewStoryData) {
    const pageId = await firstValueFrom(this.pageService.addPage(story.text, story.language))
    story.pageId = pageId;
    const storyId = await firstValueFrom(this.storyService.addStory(story))
    const note: Note = {
      storyId,
      message: `Story "${story.title.trim()}" has been added.`,
      code: 'B',
      date: Date.now()
    }
    this.noteService.addSelfNote(note);
    this.authService.refreshLoggedInUser();
  }

  search(title: string): void {
    this.error = title.trim().length < 3 && title.trim().length !== 0;
    if (!this.error)
      this.storyService.changeSearchTitle(title);
  }

  onFilter(): void {
    this.showFilter = !this.showFilter;
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
