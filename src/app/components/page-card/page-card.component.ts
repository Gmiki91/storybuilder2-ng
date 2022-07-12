import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Page, Rate } from 'src/app/shared/models/page';
import { PageService } from 'src/app/shared/services/page.service';
import { StoryService } from 'src/app/shared/services/story.service';

@Component({
  selector: 'app-page-card',
  templateUrl: './page-card.component.html',
  styleUrls: ['../style.css', './page-card.component.css'],
  animations: [
    trigger('cardFlip', [
      state('default', style({
        transform: 'none'
      })),
      state('flipped', style({
        transform: 'rotateX(180deg)'
      })),
      transition('default => flipped', [
        animate('400ms')
      ]),
      transition('flipped => default', [
        animate('400ms')
      ])
    ])
  ]
})
export class PageCardComponent implements OnInit {
  @Input() page!: Page;
  @Input() userId: string | undefined;
  @Input() storyId!: string;
  @Input() archived!: boolean
  @Input() toConfirm!: boolean;
  @Input() ownContent!: boolean;
  @Output() pageAccepted: EventEmitter<{ pageId: string, authorId: string, ratings:Rate[] }> = new EventEmitter;
  @Output() pageDeclined: EventEmitter<string> = new EventEmitter;
  @Output() pageRated: EventEmitter<number> = new EventEmitter;
  rating: number = 0;
  ratedByUser: Rate | undefined;
  liked = false;
  disliked = false;
  flipState: 'default' | 'flipped' = 'default';
  constructor(private pageService: PageService, private storyService: StoryService, private router: Router) { }

  ngOnInit(): void {
    this._checkVote();
  }

  rate(vote: number): void {
    let updatedVote = vote;
    switch (this.ratedByUser?.rate) {
      case 1: updatedVote = vote === 1 ? 0 : -2; break;
      case -1: updatedVote = vote === 1 ? 2 : 0; break;
    }
    this.pageRated.emit(updatedVote);
    firstValueFrom(this.pageService.rateText(this.page._id, updatedVote)).then(result => {
      if (result.status === 'success') this.page = result.newPage;
      this._checkVote();
    });
  }

  accept(): void {
    this.pageAccepted.emit({ pageId: this.page._id, authorId: this.page.authorId, ratings:this.page.ratings })
  }

  decline(): void {
    this.pageService.deletePage(this.page._id, this.storyId)
    firstValueFrom(this.storyService.removePendingPage(this.page._id, this.storyId))
      .then(() => this.pageDeclined.emit(this.page.authorId))
  }

  flipPage(): void {
    if (this.flipState === "default") {
      this.flipState = "flipped";
    } else {
      this.flipState = "default";
    }
  }

  addCorrection(error: string, correction: string): void {
    if (error.trim().length === 0 || correction.trim().length === 0) {
      alert('input value cannot be empty')
    } else {
      firstValueFrom(this.pageService.addCorrection(this.page._id, error, correction))
        .then(result => {
          if (result.status === "success") {
            this.page.corrections.push(result.correction);
          }
        })
        .catch(err => alert(err))
    }
  }

  _checkVote(): void {
    this.rating = this.page.ratings.reduce((sum, rating) => sum + rating.rate, 0);
    this.ratedByUser = this.page.ratings.find(rating => rating.userId === this.userId);
    if (this.ratedByUser) {
      if (this.ratedByUser.rate === 1) {
        this.liked = true;
        this.disliked = false;
      }
      if (this.ratedByUser.rate === -1) {
        this.liked = false;
        this.disliked = true;
      }
    } else {
      this.liked = false;
      this.disliked = false;
    }
  }

}
