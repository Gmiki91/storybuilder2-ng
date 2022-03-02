import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { environment } from 'src/environments/environment';
import { User } from "../shared/models/user";

@Injectable({
    providedIn: 'root'
})

export class AuthenticationService {
    userName = new BehaviorSubject<string>('');
    constructor(private httpClient: HttpClient, private router: Router) {
    }

    login(userInput: string, password: string): void {
        this.httpClient.post<{ token: string, user:User}>(`${environment.url}/users/login`, { userInput, password })
            .subscribe(result => {
                localStorage.setItem('access_token', result.token);
                this.userName.next(result.user.name)
                this.router.navigate(['/']);
            })
    }
    logout():void{
        localStorage.removeItem('access_token');
        this.userName.next('')
        this.router.navigate(['/login']);
    }

    isLoggedIn(): boolean {
        const token = localStorage.getItem('access_token');
        return (token !== null) ? true : false;
    }

    getUserName() {
        return this.userName.asObservable();
    }

    refreshLoggedInUser() {
        this.httpClient.get<{ user: User }>(`${environment.url}/users/`) //getMe
            .subscribe(result =>
                this.userName.next(result.user.name)
            );

    }
}