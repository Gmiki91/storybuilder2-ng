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
  @Input() favorite!: boolean;
  @Input() guest!: boolean;
  @Input() tribute?: boolean;

  constructor(private router: Router, private authService: AuthenticationService) {}

  onStoryClicked(): void {
    this.router.navigate([`/story/${this.story._id}`])
  }
  
  clicked(event: any): void {
    event.stopPropagation();
    if (!this.guest) {
      this.favorite = !this.favorite;
      if (this.favorite) this.authService.addToFavoriteIds(this.story._id);
      else this.authService.removeFromFavoriteIds(this.story._id);
    }
  }

}
