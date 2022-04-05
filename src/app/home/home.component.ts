import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom, Observable, Subscription, tap } from 'rxjs';
import { Story } from '../shared/models/story';
import { StoryService } from '../shared/services/story.service';
import { NewStoryComponent, NewStoryData } from '../forms/new-story/new-story.component';
import { PageService } from '../shared/services/page.service';
import { AuthenticationService } from '../shared/services/authentication.service';
import { NoteService } from '../shared/services/note.service';
import { Note } from '../shared/models/note';
import { User } from '../shared/models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  subscription: Subscription= new Subscription();
  storyList$!: Observable<Story[]>;
  user$!: Observable<User>;
  tempStoryList$!: Observable<Story[]>;
  favoriteIds:string[] = [];
  loggedIn!: boolean;
  newStory: NewStoryData = {} as NewStoryData;
  error = false;
  showFilter=false;
  loading=false;
  constructor(
    private authService: AuthenticationService,
    private storyService: StoryService,
    private pageService: PageService,
    private noteService: NoteService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
   this.loading=true;
    this.loggedIn = this.authService.isLoggedIn();
    this.storyList$ = this.storyService.getStoryList()
    .pipe(tap(result=>{
      if(result){
        this.loading=false;
      }
    }));
    this.user$ = this.authService.getCurrentUser();
    if (this.loggedIn){
      this.noteService.checkNewNotes();
      const observable$=this.authService.getFavoriteIds().subscribe(favoriteIds=>this.favoriteIds=favoriteIds);
      this.subscription.add(observable$);
    }
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

}
