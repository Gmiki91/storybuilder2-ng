import { Component, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SocialAuthService, GoogleLoginProvider } from 'angularx-social-login';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../shared/services/authentication.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth.style.css']
})
export class LoginComponent implements OnDestroy {
  subscription = new Subscription();
  loading = false;
  constructor(private authenticationService: AuthenticationService, public socialAuthService: SocialAuthService) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onLogin(form: NgForm): void {
    this.authenticationService.login(form.value.userInput, form.value.password)

  }
  loginWithGoogle(): void {
    this.loading = true;
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((result) => {
        const observable$ = this.authenticationService.loginGoogle(result.email, result.firstName).subscribe({
          next: () => this.loading = false,
          error: response => {
            alert(response.error.message);
            this.loading = false
          }
        })
        this.subscription.add(observable$)
      });
  }
}
