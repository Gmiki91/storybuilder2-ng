import { Component, ElementRef, ViewChild } from '@angular/core';

import { User } from '../shared/models/user';
import { AuthenticationService } from '../shared/services/authentication.service';
import { StoryService } from '../shared/services/story.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  @ViewChild('currentPw') currentPw!: ElementRef
  @ViewChild('currentPw2') currentPw2!: ElementRef
  @ViewChild('currentPw1') currentPw1!: ElementRef
  @ViewChild('newPw') newPw!: ElementRef
  authorId!: string;
  user!: User;

  constructor(private authentication: AuthenticationService, private storyService: StoryService) { }


  changePassword(): void {
    this.authentication.changePassword(this.currentPw.nativeElement.value, this.newPw.nativeElement.value);
  }

  deleteUser(): void {
    if (this.currentPw1.nativeElement.value === this.currentPw2.nativeElement.value) {
      this.authentication.deleteUser(this.currentPw1.nativeElement.value).subscribe({
        next: result => {
          if (result.status === 'success') {
            this.authentication.logout();
            this.storyService.deleteStories();
          }
        },
        error: response => alert(response.error.message)
      })

    } else { alert("Passwords do not match!") }
  }
  onLogout(): void {
    this.authentication.logout();
  }

}
