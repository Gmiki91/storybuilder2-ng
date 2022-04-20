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
  agreement = false;
  loading=false;

  constructor(
    private authenticationService: AuthenticationService,
    private dialog: MatDialog,
    private pageService: PageService,
    private storyService: StoryService,
    private router: Router,
    public socialAuthService: SocialAuthService,
  ) { }

  async onSignUp(form: NgForm) {
    this.loading=true;
    if (form.value.confirmPassword !== form.value.password) {
      alert('The passwords do not match');
      this.loading=false;
    } else {
      this.formData = {
        name: form.value.name.trim(),
        email: form.value.email.trim(),
        password: form.value.password.trim()
      }
      this._checkDuplicate();
    }
  }

  onSignUpGoogle() {
    this.loading=true;
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then(result => {
        this.formData = {
          name: result.firstName,
          email: result.email,
          password: ''
        }
        this._checkDuplicate();
      });
  }

  checkAgreement(check: boolean) {
    this.agreement = check;
  }

  async _checkDuplicate() {
    const result = await firstValueFrom(this.authenticationService.presignup(this.formData.name, this.formData.email));
    this.loading=false;
    if (!result.duplicate) {
      this._openDialog();
    } else if (result.duplicate) alert("Name or email is already taken")
    else alert("Something went wrong, please try again later")
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
    this.router.navigate(['/']);
  }

}
