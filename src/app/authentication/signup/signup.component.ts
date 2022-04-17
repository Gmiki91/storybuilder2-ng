import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { firstValueFrom } from 'rxjs';
import { NewStoryComponent, NewStoryData } from 'src/app/forms/new-story/new-story.component';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { PageService } from 'src/app/shared/services/page.service';
import { StoryService } from 'src/app/shared/services/story.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../auth.style.css']
})
export class SignupComponent {
  newStory: NewStoryData = {} as NewStoryData;
  formData = { name: '', email: '', password: '' }

  constructor(
    private authenticationService: AuthenticationService,
    private dialog: MatDialog,
    private pageService: PageService,
    private storyService: StoryService,
    private router: Router,
    public socialAuthService: SocialAuthService,
  ) { }

  async onSignUp(form: NgForm) {
    if (form.value.confirmPassword !== form.value.password) {
      alert('The passwords do not match');
    } else {
      const name = form.value.name.trim();
      const email = form.value.email.trim();
      const password = form.value.password.trim();
      this.formData = { name, email, password }
      const result = await firstValueFrom(this.authenticationService.presignup(name, email));
      if (!result.duplicate) {
        this._openDialog();
      } else if (result.duplicate) alert("Name or email is already taken")
      else alert("Something went wrong, please try again later")
    }
  }

  onSignUpGoogle() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then(result => {
        this.formData.name = result.firstName
        this.formData.email = result.email
        this._openDialog();
      });
  }

  async _openDialog() {
    const dialogRef = this.dialog.open(NewStoryComponent, {
      data: { story: this.newStory },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((story: NewStoryData) => {
      if (story !== undefined) {
        this._confirmSignUp(story);
      } else {
        this._openDialog();
      }
    });
  }

  async _confirmSignUp(story: NewStoryData) {
    await firstValueFrom(this.authenticationService.signup(this.formData.name, this.formData.email, this.formData.password))
    const { pageId } = await firstValueFrom(this.pageService.addPage(story.text, story.language));
    story.pageId = pageId;
    firstValueFrom(this.storyService.addStory(story))
    this.router.navigate(['/daily']);
  }

}
