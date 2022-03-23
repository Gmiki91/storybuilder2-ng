import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { NewStoryComponent, NewStoryData } from 'src/app/forms/new-story/new-story.component';
import { Note } from 'src/app/shared/models/note';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { NoteService } from 'src/app/shared/services/note.service';
import { PageService } from 'src/app/shared/services/page.service';
import { StoryService } from 'src/app/shared/services/story.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent  {
  newStory: NewStoryData = {} as NewStoryData;
  formData = { name: '', email: '', password: '' }

  constructor(private authenticationService: AuthenticationService,
    private dialog: MatDialog,
    private pageService: PageService,
    private storyService: StoryService,
    private noteService: NoteService,
    private router: Router
  ) { }

  async onSignUp(form: NgForm) {
    if (form.value.confirmPassword !== form.value.password) {
      alert('The passwords do not match');
    } else {
      const name = form.value.name.trim();
      const email = form.value.email.trim();
      const password = form.value.password.trim();
      this.formData = { name, email, password }
      const result = await lastValueFrom(this.authenticationService.presignup(name, email));
      if (!result.duplicate) {
        this._openDialog();
      } else if (result.duplicate) alert("Name or email is already taken")
      else alert("Something went wrong, please try again later")
    }
  }

  async _openDialog() {
    const dialogRef = this.dialog.open(NewStoryComponent, {
      data: { story: this.newStory }
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
    await lastValueFrom(this.authenticationService.signup(this.formData.name, this.formData.email, this.formData.password))
    const pageId = await lastValueFrom(this.pageService.addPage(story.text, story.language));
    story.pageId = pageId;
    const storyId = await lastValueFrom(this.storyService.addStory(story))
    const note: Note = {
      storyId,
      message: `Story "${story.title.trim()}" has been added.`,
      code: 'B',
      date: Date.now()
    }
    this.noteService.addSelfNote(note);
    this.router.navigate(['/']);
  }

}
