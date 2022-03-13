import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { map,Subject } from "rxjs";
import { environment } from 'src/environments/environment';
import { User } from "../models/user";

@Injectable({
    providedIn: 'root'
})

export class AuthenticationService {
    user = new Subject<User>();
    constructor(private httpClient: HttpClient, private router: Router) {}

    login(userInput: string, password: string): void {
        this.httpClient.post<{ token: string, user:User}>(`${environment.url}/users/login`, { userInput, password })
            .subscribe(result => {
                localStorage.setItem('access_token', result.token);
                this.user.next(result.user)
                this.router.navigate(['/']);
            })
    }
    logout():void{
        localStorage.removeItem('access_token');
        this.user.next({}as User)
        this.router.navigate(['/login']);
    }

    isLoggedIn(): boolean {
        const token = localStorage.getItem('access_token');
        return (token !== null) ? true : false;
    }

    getCurrentUser() {
        return this.user.asObservable();
    }
    
    getUser(userId:string){
        return this.httpClient.get<{result:string, user:User}>(`${environment.url}/users/user/${userId}`)
        .pipe(map(result => result.user))
    }

    refreshLoggedInUser() {
        this.httpClient.get<{ user: User }>(`${environment.url}/users/`) //getMe
            .subscribe(result =>
                this.user.next(result.user)
            );

    }
}