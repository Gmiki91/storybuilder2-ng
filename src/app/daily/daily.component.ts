import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Story } from '../shared/models/story';
import { AuthenticationService } from '../shared/services/authentication.service';
import { StoryService } from '../shared/services/story.service';
type Data = {
  story: Story,
  hoursLeft: number,
  minutesLeft: number
}
@Component({
  selector: 'app-daily',
  templateUrl: './daily.component.html',
  styleUrls: ['./daily.component.css']
})
export class DailyComponent implements OnInit {

  dailyData$!: Observable<Data>;
  constructor(private storyService: StoryService, private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.dailyData$ = this.storyService.getDaily()
      .pipe(map(data => {
        this.authService.refreshLoggedInUser();
        return ({ ...data, hoursLeft: Math.ceil(data.hoursLeft), minutesLeft: Math.ceil(data.minutesLeft) })
      }));
  }

}
