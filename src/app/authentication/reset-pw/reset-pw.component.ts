import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-reset-pw',
  templateUrl: './reset-pw.component.html',
  styleUrls: ['../auth.style.css']
})
export class ResetPwComponent {

  constructor(private authenticationService: AuthenticationService, private route: ActivatedRoute) { 
  }

  onClick(form: NgForm) {
    if (form.value.confirmPassword !== form.value.password) {
      alert('The passwords do not match');
    } else {
      const token = this.route.snapshot.paramMap.get('token');
      if (token) {
        this.authenticationService.resetPassword(token, form.value.password);
      } else {
        alert('Something went wrong. Please try again.')
      }
    }
  }

}
