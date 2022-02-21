import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private authentication:AuthenticationService) { }

  ngOnInit(): void {
  }

  onLogout():void{
   this.authentication.logout();
  }
}
