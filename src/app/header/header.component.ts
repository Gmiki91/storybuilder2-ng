import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../shared/models/user';
import { AuthenticationService } from '../shared/services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user$!: Observable<User>;
  loggedIn=false;
  constructor(private authentication: AuthenticationService) { }

  ngOnInit(): void {
    this.user$ = this.authentication.getCurrentUser();
    this.loggedIn = this.authentication.isLoggedIn()
    if (this.loggedIn)
      this.authentication.refreshLoggedInUser();
    else
      this.user$ = of({} as User)
  }

}
