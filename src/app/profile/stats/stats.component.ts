import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import moment from 'moment';
import { Observable, map,firstValueFrom } from 'rxjs';
import { PageData } from 'src/app/shared/models/page';
import { StoryData } from 'src/app/shared/models/story';
import { User } from '../../shared/models/user';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { PageService } from '../../shared/services/page.service';
import { StoryService } from '../../shared/services/story.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})

export class StatsComponent implements OnInit {
  @Input() isMe: boolean = false;
  authorId!: string;
  user!: User;
  userData$!: Observable<User>;
  storyData$!: Observable<StoryData>;
  pageData$!: Observable<PageData>
  lastActivity: string = "";

  constructor(
    private authentication: AuthenticationService,
    private storyService: StoryService,
    private pageService: PageService,
    private router: Router
  ) {
    let nav = this.router.getCurrentNavigation();
    if (nav?.extras.state) {
      this.authorId = nav.extras.state['authorId'];
    }
  }

  ngOnInit(): void {
   this.getData();
  }

  async getData() {
    if (this.isMe) {
      this.authentication.refreshLoggedInUser();
      this.user = await firstValueFrom(this.authentication.getCurrentUser());
    } else {
      this.user = await firstValueFrom(this.authentication.getUser(this.authorId));
    }
    this.lastActivity = moment.utc(this.user.lastActivity).local().startOf('seconds').fromNow();
    this.storyData$ = this.storyService.getStoryData(this.user._id).pipe(map(storyData =>
      ({ ...storyData, rating: storyData.totalVotes !== 0 ? `${(storyData.upVotes / storyData.totalVotes * 100).toFixed()}%` : '' })));
    this.pageData$ = this.pageService.getPageData(this.user._id).pipe(map(pageData =>
      ({ ...pageData, rating: pageData.totalVotes !== 0 ? `${(pageData.upVotes / pageData.totalVotes * 100).toFixed()}%` : '' })));
  }

}
