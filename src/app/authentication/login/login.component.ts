import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SocialAuthService, GoogleLoginProvider } from 'angularx-social-login';
import { AuthenticationService } from '../../shared/services/authentication.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth.style.css']
})
export class LoginComponent implements OnInit {
  loading=false;
  constructor(private authenticationService: AuthenticationService, public socialAuthService: SocialAuthService) { }

  ngOnInit(): void {
  }

  onLogin(form: NgForm): void {
    this.authenticationService.login(form.value.userInput, form.value.password);
  }
  loginWithGoogle(): void {
    this.loading=true;
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((result) =>{
       this.loading=false;
        this.authenticationService.loginGoogle(result.email, result.firstName)
      });
  }
}
