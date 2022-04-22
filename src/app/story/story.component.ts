import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, map, Subscription, firstValueFrom } from 'rxjs';
import { EditStoryComponent } from '../forms/edit-story/edit-story.component';
import { NewPageComponent } from '../forms/new-page/new-page.component';
import { NewWordsComponent } from '../forms/new-words/new-words.component';
import { RateLevelComponent } from '../forms/rate-level/rate-level.component';
import { Note } from '../shared/models/note';
import { Page } from '../shared/models/page';
import { Story } from '../shared/models/story';
import { User } from '../shared/models/user';
import { AuthenticationService } from '../shared/services/authentication.service';
import { NoteService } from '../shared/services/note.service';
import { PageService } from '../shared/services/page.service';
import { StoryService } from '../shared/services/story.service';

type PageType = 'Confirmed' | 'Pending';
type emitObject = { pageId: string, authorId: string }
const PAG_SIZE = 10;
@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.css']
})
export class StoryComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();

  user!: User;
  story!: Story;

  storyLoaded: boolean = false;
  pageList$!: Observable<Page[]>;
  currentPaginationCount = 0;
  start = 0;
  end = 0;
  maxPageCount = 0;
  toggleTypeLabel: PageType = 'Pending';
  hideToggle: boolean = true;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthenticationService,
    private storyService: StoryService,
    private noteService: NoteService,
    private pageService: PageService) {

    let nav = this.router.getCurrentNavigation();
    if (nav?.extras.state) {
      this.storyService.updateStory(nav.extras.state['storyId']);
    } else {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.storyLoaded = false;
    this.getUser();
    this.getStory();
    this._getPageList();
    this._getPages('Confirmed');
    this.hideToggle = this.story?.pendingPageIds.length === 0;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getUser() {
    const observable$ = this.authService.getCurrentUser()
      .subscribe(user => {
        if (user._id) {
          this.user = user;
        }
      });
    this.subscription.add(observable$);
    if (this.authService.isLoggedIn())
      this.authService.refreshLoggedInUser();
  }

  getStory() {
    const observable$ = this.storyService.getStory()
      .subscribe(story => {
        this.story = story;
        this.storyLoaded = true;
        if (story.pendingPageIds.length === 0) {
          this.hideToggle = true;
        }
        const type = story.pendingPageIds.length > 0 && this.toggleTypeLabel === 'Confirmed' ? 'Pending' : 'Confirmed';
        this.toggleTypeLabel = type === 'Confirmed' ? 'Pending' : 'Confirmed';
        this._getPages(type);
      });
    this.subscription.add(observable$);
  }


  changeToggle(type: PageType): void {
    this.toggleTypeLabel = type === 'Confirmed' ? 'Pending' : 'Confirmed';
    this._getPages(type);
  }

  submitNewWords(): void {
    const dialogRef = this.dialog.open(NewWordsComponent, {
      data: [this.story.word1, this.story.word2, this.story.word3],
      disableClose: true
    });
    dialogRef.afterClosed()
      .subscribe(async (words: string[]) => {
        if (words.length === 0) this.submitNewWords();
        else {
          this.storyService.addWords(this.story._id, words[0], words[1], words[2]);
        }
      })
  }

  async pageAccepted(result: emitObject) {
    if (confirm('All other pending pages will be rejected. Are you sure?')) {
      this.submitNewWords();
      this.hideToggle = true;
      this._sendAcceptNote(result.authorId);
      if (this.story.pendingPageIds.length > 1) {
        const index = this.story.pendingPageIds.indexOf(result.pageId)
        const idsToDelete = [...this.story.pendingPageIds];
        idsToDelete.splice(index, 1);
        const response = await firstValueFrom(this.pageService.deletePages(idsToDelete, this.story._id));
        this._sendRejectNotes(response.authorIds);
      }
      this.storyService.updateStory(this.story._id);
      this.changeToggle('Confirmed');
    }
  }

  pageDeclined(authorId: string) {
    this.storyService.updateStory(this.story._id);
    this._sendRejectNotes([authorId]);
  }

  pageRated(rate: number) {
    if (this.toggleTypeLabel === 'Pending')//means user rating confirmed pages, which must be shown on storycard as well
      this.storyService.rateText(this.story._id, rate)
  }

  onLevelClicked() {
    const dialogRef = this.dialog.open(RateLevelComponent, {
      data: this.story.level
    });
    dialogRef.afterClosed().subscribe(rate => {
      if (rate !== undefined) {
        this.storyService.rateLevel(this.story._id, rate)
      }
    });
  }

  onTitleClicked() {
    if (this.user._id) {
      const dialogRef = this.dialog.open(EditStoryComponent, {
        data: { story: { ...this.story }, userId: this.user._id }
      });
      dialogRef.afterClosed().subscribe(data => {
        if (data && (data.description !== this.story.description || data.title !== this.story.title)) {
          this.storyService.editStory(this.story._id, data.title, data.description);
        }
      });
    }
  }

  forward() {
    this.currentPaginationCount += 1;
    this._getPages(this.toggleTypeLabel == 'Confirmed' ? 'Pending' : 'Confirmed');
  }

  backward() {
    this.currentPaginationCount -= 1;
    this._getPages(this.toggleTypeLabel == 'Confirmed' ? 'Pending' : 'Confirmed');
  }

  addPage() {
    if (this.user.coins >= 3 || (this.user.markedStoryId === this.story._id && !this.user.dailyCompleted)) {
      const dialogRef = this.dialog.open(NewPageComponent, {
        data: [this.story.word1, this.story.word2, this.story.word3]
      });
      dialogRef.afterClosed()
        .subscribe(async (text: string) => {
          if (text && text !== '') {
            const currentStoryLength = this.story.pageIds.length;
            this.storyService.updateStory(this.story._id);
            const updatedStory = await firstValueFrom(this.storyService.getStory());
            if (currentStoryLength === updatedStory.pageIds.length) {
              const { pageId, tributeCompleted } = await firstValueFrom(this.pageService.addPage(text, this.story.language.text, this.story._id))
              this.storyService.addPendingPage(pageId, this.story._id)
              if (this.user._id !== this.story.authorId) this._sendSubmitionNote();
              if (tributeCompleted) alert('You completed your daily task. Well done!');
              else alert('Your text has been submitted');
              this.router.navigate(['/']);
            } else {
              alert('A page has been accepted while you were typing. Please check the new contribution by refreshing the story.')
            }
          }
        })
    } else {
      alert(`You need 3 coins to write a new page. You can get coins by completing the daily task.`)
    }
  }

  _getPageList() {
    this.pageList$ = this.pageService.getPageList().pipe(map(pages => {
      this.maxPageCount = pages.length;
      this.start = this.currentPaginationCount * PAG_SIZE;
      this.end = this.start + PAG_SIZE;
      return pages.slice(this.start, this.end);
    }))
  }

  _getPages(type: PageType): void {
    const ids = type === 'Confirmed' ? 'pageIds' : 'pendingPageIds';
    if (this.story) {
      this.pageService.updatePageList(this.story[ids]);
    }
  }

  _sendSubmitionNote() {
    const note: Note = {
      code: 'B',
      date: Date.now(),
      storyId: this.story._id,
      message: `You've submitted page #${this.story.pageIds.length} for story "${this.story.title}". It is pending confirmation.`
    }

    this.noteService.addSelfNote(note);
    note.message = `Page #${this.story.pageIds.length} has been submitted to your story "${this.story.title}". It is waiting your confirmation.`;
    this.noteService.addNotes(this.story.authorId, note);
  }

  _sendRejectNotes(ids: string[]) {
    const note: Note = {
      code: 'C',
      date: Date.now(),
      storyId: this.story._id,
      message: `Your submition for page #${this.story.pageIds.length} for story "${this.story.title}" has been rejected.`
    }
    this.noteService.addNotes(ids.join(','), note);
  }

  _sendAcceptNote(authorId: string) {
    const note: Note = {
      code: 'A',
      date: Date.now(),
      storyId: this.story._id,
      message: `Your submition for page #${this.story.pageIds.length} for story "${this.story.title}" has been accepted.`
    }

    this.noteService.addNotes(authorId, note);
  }

}
