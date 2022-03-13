import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import moment from 'moment';
import { Observable, map, lastValueFrom, firstValueFrom } from 'rxjs';
import { User } from '../shared/models/user';
import { AuthenticationService } from '../shared/services/authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  authorId!: string;
  user!: User;
  
  constructor(
    private authentication: AuthenticationService,
    private router: Router) {}

  ngOnInit(): void {
   
  }


  onLogout(): void {
    this.authentication.logout();
  }

}
