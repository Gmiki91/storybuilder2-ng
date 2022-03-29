import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../shared/models/user';
import { AuthenticationService } from '../shared/services/authentication.service';
import { NoteService } from '../shared/services/note.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user$!: Observable<User>;
  notification$!:Observable<boolean>;
  loggedIn=false;
  constructor(private authentication: AuthenticationService, private noteService:NoteService) { }

  ngOnInit(): void {
    this.user$ = this.authentication.getCurrentUser();
    this.notification$ = this.noteService.isNews();
    this.loggedIn = this.authentication.isLoggedIn()
    if (this.loggedIn)
      this.authentication.refreshLoggedInUser();
    else
      this.user$ = of({} as User)
  }

}
