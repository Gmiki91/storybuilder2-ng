import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Page, Rate } from 'src/app/shared/models/page';
import { PageService } from 'src/app/shared/services/page.service';
import { StoryService } from 'src/app/shared/services/story.service';

@Component({
  selector: 'app-page-card',
  templateUrl: './page-card.component.html',
  styleUrls: ['../style.css']
})
export class PageCardComponent implements OnInit {

  @Input() page!: Page;
  @Input() userId!: string;
  @Input() storyId!: string;
  @Input() toConfirm!: boolean;
  @Input() ownContent!: boolean;
  @Output() pageAccepted: EventEmitter<string> = new EventEmitter;
  @Output() pageDeclined: EventEmitter<string> = new EventEmitter;
  rating: number = 0;
  ratedByUser: Rate | undefined;
  liked: boolean = false;
  disliked: boolean = false;
  constructor(private pageService: PageService, private storyService: StoryService, private router: Router) {
  }

  ngOnInit(): void {
    this.checkVote();
  }

  rate(vote: number): void {
    let updatedVote = vote;
    switch (this.ratedByUser?.rate) {
      case 1: updatedVote = vote === 1 ? 0 : -2; break;
      case -1: updatedVote = vote === 1 ? 2 : 0; break;
    }
    firstValueFrom(this.pageService.rateText(this.page._id, updatedVote)).then(result => {
      if (result.status === 'success') this.page = result.newPage;
      this.checkVote();
    });
  }

  accept(): void {
    firstValueFrom(this.storyService.addPage(this.page._id, this.storyId, this.page.ratings))
      .then(() => this.pageAccepted.emit(this.page._id))
  }

  decline(): void {
    this.pageService.deletePage(this.page._id, this.storyId)
    firstValueFrom(this.storyService.removePendingPage(this.page._id, this.storyId))
      .then(() => this.pageDeclined.emit(this.page._id))
  }

  checkVote(): void {
    this.rating = this.page.ratings.reduce((sum, rating) => sum + rating.rate, 0);
    this.ratedByUser = this.page.ratings.find(rating => rating.userId === this.userId);
    if (this.ratedByUser?.rate === 1) { 
      this.liked = true;
      this.disliked = false;
    }
    if (this.ratedByUser?.rate === -1) {
      this.liked = false;
      this.disliked = true;
    }
  }
  onAuthor(event:MouseEvent):void{
    event.stopPropagation();
    this.router.navigate(['/stats'], { state: { authorId:this.page.authorId } })
  }
}
