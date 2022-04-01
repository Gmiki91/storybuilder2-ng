import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-forgot-pw',
  templateUrl: './forgot-pw.component.html',
  styleUrls: ['../auth.style.css']
})
export class ForgotPwComponent {
  loading = false;
  constructor(private authenticationService: AuthenticationService) { }

  async onClick(form: NgForm) {
    this.loading = true;
    const response = await lastValueFrom(this.authenticationService.forgotPassword(form.value.userInput))
      .catch(response => alert(response.error.message));
    if (response)
      alert(response.message);
    this.loading = false;
  }

}
