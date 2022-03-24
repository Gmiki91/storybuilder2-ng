import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Story } from 'src/app/shared/models/story';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
@Component({
  selector: 'app-story-card',
  templateUrl: './story-card.component.html',
  styleUrls: ['../style.css']
})
export class StoryCardComponent{
  @Input() story!: Story;
  @Input() favorite!:boolean;
  @Input() tribute?:boolean;
  icon!: string;

  constructor(private router: Router, private authService: AuthenticationService) { }

  onStoryClicked(): void {
    this.router.navigate(['/story'], { state: { storyId: this.story._id } })
  }

  clicked(event: any): void {
    this.favorite = !this.favorite;
    if(this.favorite) this.authService.addToFavoriteIds(this.story._id);
    else this.authService.removeFromFavoriteIds(this.story._id);
    event.stopPropagation();
  }

}
