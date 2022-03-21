import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthenticationService } from "./services/authentication.service";

@Injectable({
    providedIn: 'root'
})
export class PrivateGuard implements CanActivate {

    constructor(private router: Router, private authService: AuthenticationService) { };
    canActivate(): boolean {
        if (!this.authService.isLoggedIn()) {
            this.router.navigate(['/']);
            return false;
        } else
            return true
    }
}