import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-forgot-pw',
  templateUrl: './forgot-pw.component.html',
  styleUrls: ['../auth.style.css']
})
export class ForgotPwComponent {

  constructor(private authenticationService:AuthenticationService) { }

  onClick(form: NgForm) {
    this.authenticationService.forgotPassword(form.value.userInput);
 }

}
