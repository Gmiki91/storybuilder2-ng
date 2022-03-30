import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { map,tap, Subject } from "rxjs";
import { environment } from 'src/environments/environment';
import { User } from "../models/user";

@Injectable({
    providedIn: 'root'
})

export class AuthenticationService {
    user = new Subject<User>();
    constructor(private httpClient: HttpClient, private router: Router) { }

    presignup(name: string, email: string) {
        return this.httpClient.post<{ status: string, duplicate: boolean }>(`${environment.url}/users/presignup`, { name, email })
    }

    signup(name: string, email: string, password: string) {
        return this.httpClient.post<{ status: string, token: string, user: User, }>(`${environment.url}/users/signup`, { name, email, password })
            .pipe(tap(result => {
                this.user.next(result.user);
                localStorage.setItem('access_token', result.token);
            }))
    }

    login(userInput: string, password: string): void {
        this.httpClient.post<{ token: string, user: User }>(`${environment.url}/users/login`, { userInput, password })
            .subscribe({
                next: result => {
                    this.user.next(result.user);
                    localStorage.setItem('access_token', result.token);
                    this.router.navigate(['/daily']);
                },
                error: response => { alert(response.error.message) }
            })
    }

    loginGoogle(email:string, name:string){
        this.httpClient.post<{ token: string, user: User }>(`${environment.url}/users/loginGoogle`,{email, name})
        .subscribe({
            next: result => {
                this.user.next(result.user);
                localStorage.setItem('access_token', result.token);
                this.router.navigate(['/daily']);
            },
            error: response => { alert(response.error.message) }
        })
    }

    logout(): void {
        localStorage.removeItem('access_token');
        this.user.next({} as User)
        this.router.navigate(['/']);
    }

    changePassword(currentPassword: string, newPassword: string): void {
        this.httpClient.patch<{ message: string, token: string }>(`${environment.url}/users/updatePassword`, { currentPassword, newPassword })
            .subscribe({
                next: result => {
                    localStorage.setItem('access_token', result.token);
                    alert('Password has been changed!')
                },
                error: response => { alert(response.error.message) }
            })
    }

    forgotPassword(email: string): void {
        this.httpClient.post<{ status: string, message: string, }>(`${environment.url}/users/forgotPassword`, { email: email.trim() })
            .subscribe({
                next: result => {
                    alert(result.message)
                },
                error: response => { alert(response.error.message) }
            })
    }

    resetPassword(resetToken: string, newPw: string) {
        this.httpClient.patch<{ status: string, token: string }>(`${environment.url}/users/resetPassword/${resetToken}`, { password: newPw.trim() })
            .subscribe({
                next: result => {
                    localStorage.setItem('access_token', result.token);
                    this.refreshLoggedInUser();
                    this.router.navigate(['/daily']);
                },
                error: response => { alert(response.error.message) }
            })
    }

    deleteUser(deletePassword: string) {
        return this.httpClient.patch<{ status: string, message: string }>(`${environment.url}/users/`, { deletePassword })
    }

    isLoggedIn(): boolean {
        const token = localStorage.getItem('access_token');
        return token !== null;
    }

    getCurrentUser() {
        return this.user.asObservable();
    }

    getUser(userId: string) {
        return this.httpClient.get<{ result: string, user: User }>(`${environment.url}/users/user/${userId}`)
            .pipe(map(result => result.user))
    }
    getFavoriteIds() {
        return this.httpClient.get<{ result: string, data: string[] }>(`${environment.url}/users/favorites`)
            .pipe(map(result => result.data))
    }

    addToFavoriteIds(storyId: string) {
        this.httpClient.post(`${environment.url}/users/favorites`, { storyId }).subscribe(() => { })
    }

    removeFromFavoriteIds(storyId: string) {
        this.httpClient.put(`${environment.url}/users/favorites`, { storyId }).subscribe(() => { })
    }

    refreshLoggedInUser() {
        this.httpClient.get<{ user: User }>(`${environment.url}/users/`) //getMe
            .subscribe(result => {
                this.user.next(result.user)
            });
    }
}