import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  loggedIn:boolean = false;
  constructor(private authentication:AuthenticationService) { }

  ngOnInit(): void {
    this.loggedIn = this.authentication.isLoggedIn();
  }

}
