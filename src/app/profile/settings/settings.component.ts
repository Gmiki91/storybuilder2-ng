import { Component, ElementRef, ViewChild } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { StoryService } from 'src/app/shared/services/story.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  @ViewChild('currentPw') currentPw!: ElementRef
  @ViewChild('currentPw2') currentPw2!: ElementRef
  @ViewChild('currentPw1') currentPw1!: ElementRef
  @ViewChild('newPw') newPw!: ElementRef
  constructor(private authentication: AuthenticationService, private storyService: StoryService) { }

  changePassword(): void {
    this.authentication.changePassword(this.currentPw.nativeElement.value, this.newPw.nativeElement.value);
  }

  async deleteUser() {
    if (this.currentPw1.nativeElement.value === this.currentPw2.nativeElement.value) {
      const result = await firstValueFrom(this.authentication.deleteUser(this.currentPw1.nativeElement.value))
      if (result.status === 'success') {
        this.authentication.logout();
        this.storyService.deleteStories();
      }
    } else { alert("Passwords do not match!") }
  }
}