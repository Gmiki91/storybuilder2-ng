import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { User } from '../shared/models/user';
import { AuthenticationService } from '../shared/services/authentication.service';
import { NoteService } from '../shared/services/note.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  subscription = new Subscription();
  user!: User;
  notification$!: Observable<boolean>;
  constructor(private authentication: AuthenticationService, private noteService: NoteService) { }

  ngOnInit(): void {
    const observable$ = this.authentication.getCurrentUser()
      .subscribe(user => this.user = user)
    this.subscription.add(observable$);
    this.notification$ = this.noteService.isNews();
    const loggedIn = this.authentication.isLoggedIn()
    if (loggedIn)
      this.authentication.refreshLoggedInUser();
    else
      this.user = {} as User
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
