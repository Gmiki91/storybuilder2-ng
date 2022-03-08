import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, map } from "rxjs";
import { environment } from "src/environments/environment";
import { Page } from "../models/page";

@Injectable({
    providedIn: 'root'
})
export class PageService {
    pageList = new BehaviorSubject<Page[]>([])
    constructor(private http: HttpClient) { }

    updatePageList(ids: string[]): void {
        this.http.get<{ status: string, pages: Page[] }>(`${environment.url}/pages/many/${ids}`)
            .subscribe(result => this.pageList.next(result.pages));
    }

    getPageList(): Observable<Page[]> {
        return this.pageList.asObservable();
    }

    addPage(text:string,language:string): Observable<string> {
        return this.http.post<{ status: string, pageId: string }>(`${environment.url}/pages/`,{text,language})
            .pipe(map(result => result.pageId));
    }

}