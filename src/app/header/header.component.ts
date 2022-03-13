import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../shared/models/user';
import { AuthenticationService } from '../shared/services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user$!: Observable<User>;

  constructor(private authentication: AuthenticationService) {}

  ngOnInit(): void {
    this.user$ = this.authentication.getCurrentUser();
    if (this.authentication.isLoggedIn())
      this.authentication.refreshLoggedInUser();
  }

}
