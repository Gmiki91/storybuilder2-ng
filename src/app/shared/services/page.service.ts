import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, map } from "rxjs";
import { environment } from "src/environments/environment";
import { Correction, Page } from "../models/page";
import { LangInfo } from '../models/languageData';

@Injectable({
    providedIn: 'root'
})
export class PageService {
    pageList = new BehaviorSubject<Page[]>([])
    constructor(private http: HttpClient) { }

    updatePageList(ids: string[]): void {
        this.http.get<{ status: string, pages: Page[] }>(`${environment.url}/pages/many/${ids.join(',')}`)
            .subscribe(result => this.pageList.next(result.pages));
    }

    getPageList(): Observable<Page[]> {
        return this.pageList.asObservable();
    }

    getPageData(authorId: string) {
        return this.http.get<{ status: string, size:number, langInfo:LangInfo[], upVotes:number, totalVotes:number  }>(`${environment.url}/pages/data/${authorId}`)
    }

    addPage(text: string, language: string, storyId?:string){
        return this.http.post<{ status: string, pageId: string,tributeCompleted: boolean }>(`${environment.url}/pages/`, { text, language,storyId })
            .pipe(map(result => ({pageId:result.pageId, tributeCompleted:result.tributeCompleted})));
    }

    
    deletePages(ids: string[], storyId: string) {
        return this.http.patch<{ status: string, authorIds: string[] }>(`${environment.url}/pages/many/${ids.join(',')}`, { storyId })
    }
    
    deletePage(pageId: string, storyId: string): void {
        this.http.patch(`${environment.url}/pages/one/${pageId}`, { storyId }).subscribe(() => { })
    }

    rateText(pageId: string, vote: number) {
        return this.http.put<{ status: string, newPage: Page }>(`${environment.url}/pages/rateText`, { vote, pageId });
    }

    addCorrection(pageId:string,error:string,correction:string) {
        return this.http.post<{status:string, correction:Correction}>(`${environment.url}/pages/one/${pageId}`,{error,correction});
    }
}