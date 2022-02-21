import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { environment } from 'src/environments/environment';
import { User } from "../models/user";

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    userName = new BehaviorSubject<string>('');
    constructor(private http: HttpClient, private router: Router) {
    }

    login(userInput: string, password: string): void {
        this.http.post<{ token: string, user: User }>(`${environment.url}/users/login`, { userInput, password })
            .subscribe(result => {
                localStorage.setItem('access_token', result.token);

                this.router.navigate(['/']);
            })
    }

    isLoggedIn(): boolean {
        const token = localStorage.getItem('access_token');
        return (token !== null) ? true : false;
    }

    getUserName() {
        return this.userName.asObservable();
    }

    refreshLoggedInUser() {
        this.http.get<{ user: User }>(`${environment.url}/users/`) //getMe
            .subscribe(result =>
                this.userName.next(result.user.name)
            );

    }
}