import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { EditStoryComponent } from '../forms/edit-story/edit-story.component';
import { RateLevelComponent } from '../forms/rate-level/rate-level.component';
import { Page } from '../shared/models/page';
import { Story } from '../shared/models/story';
import { User } from '../shared/models/user';
import { AuthenticationService } from '../shared/services/authentication.service';
import { PageService } from '../shared/services/page.service';
import { StoryService } from '../shared/services/story.service';

type PageType = 'Confirmed' | 'Pending';
const PAG_SIZE = 2;
@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.css']
})
export class StoryComponent implements OnInit {

  user!: User;
  story!: Story;
  pageList$!: Observable<Page[]>;
  currentPaginationCount = 0;
  start=0;
  end=0;
  maxPageCount=0;
  toggleTypeLabel: PageType = 'Pending';
  hideToggle: boolean = true;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthenticationService,
    private storyService: StoryService,
    private pageService: PageService) {

    let nav = this.router.getCurrentNavigation();
    if (nav?.extras.state){
      const storyId = nav.extras.state['storyId'];
      this.storyService.updateStory(storyId);
    }
  }

  ngOnInit(): void {
    this.authService.refreshLoggedInUser();
    this.authService.getCurrentUser()
      .subscribe(user => {
        if (user !== undefined) this.user = user
      });
    this.storyService.getStory()
      .subscribe(story => {
        this.story = story;
        if (story.pendingPageIds.length === 0) {
          this.hideToggle = true;
        }
        const type = story.pendingPageIds.length > 0 && this.toggleTypeLabel === 'Confirmed' ? 'Pending' : 'Confirmed';
        this.toggleTypeLabel = type === 'Confirmed' ? 'Pending' : 'Confirmed';
        this.getPages(type);
      });
    this.pageList$ = this.pageService.getPageList().pipe(map(pages=>{
      this.maxPageCount = pages.length;
      this.start = this.currentPaginationCount*PAG_SIZE;
      this.end = this.start+PAG_SIZE;
      return pages.slice(this.start,this.end);
    }))
    this.getPages('Confirmed');
    this.hideToggle = this.story?.pendingPageIds.length === 0;
  }

  getPages(type: PageType): void {
    const ids = type === 'Confirmed' ? 'pageIds' : 'pendingPageIds';
    if(this.story)
      this.pageService.updatePageList(this.story[ids]);
  }

  changeToggle(type: PageType):void{
    this.toggleTypeLabel = type === 'Confirmed' ? 'Pending' : 'Confirmed';
    this.getPages(type);
  }

  pageAccepted(id: string): void {
    this.hideToggle = true;
    if (this.story.pendingPageIds.length > 1) {
      const index = this.story.pendingPageIds.indexOf(id)
      const idsToDelete = [...this.story.pendingPageIds];
      idsToDelete.splice(index, 1);
      this.pageService.deletePages(idsToDelete, this.story._id);
    }
    this.storyService.updateStory(this.story._id);
  }

  pageDeclined() {
    this.storyService.updateStory(this.story._id);
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
    const dialogRef = this.dialog.open(EditStoryComponent, {
      data: { story: { ...this.story }, userId: this.user._id }
    });
    dialogRef.afterClosed().subscribe(description => {
      if (description && description !== this.story.description) {
        this.storyService.editStory(this.story._id, description);
      }
    });
  }

  forward() {
    this.currentPaginationCount += 1;
    this.getPages(this.toggleTypeLabel=='Confirmed' ? 'Pending' : 'Confirmed');
  }

  backward() {
    this.currentPaginationCount -= 1;
    this.getPages(this.toggleTypeLabel=='Confirmed' ? 'Pending' : 'Confirmed');

  }
}
