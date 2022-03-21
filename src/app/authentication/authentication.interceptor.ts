import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler
} from "@angular/common/http";
import { Injectable } from "@angular/core";


@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const authToken = localStorage.getItem('access_token');
        if(authToken) {
            const authRequest = req.clone({
                headers: req.headers.set("Authorization", "Bearer " + authToken)
            });
            return next.handle(authRequest);
        }
        return next.handle(req)
       
    }
}