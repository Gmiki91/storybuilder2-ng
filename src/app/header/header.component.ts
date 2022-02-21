import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userName$: Observable<string> | undefined;

  constructor(private authentication: AuthenticationService) {}

  ngOnInit(): void {
    this.userName$ = this.authentication.getUserName();
    if (this.authentication.isLoggedIn())
      this.authentication.refreshLoggedInUser();
  }

}
