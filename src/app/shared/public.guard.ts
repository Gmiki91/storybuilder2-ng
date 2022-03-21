import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class PublicGuard implements CanActivate {

    constructor(private router: Router) { };
    canActivate(): boolean {
        if (localStorage.getItem('access_token')) {
            this.router.navigate(['/']);
            return false;
        } else
            return true
    }
}