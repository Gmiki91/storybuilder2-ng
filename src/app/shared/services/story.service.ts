import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map, BehaviorSubject } from "rxjs";
import { Story } from "../models/story";
import { environment } from '../../../environments/environment';
import * as moment from "moment";
import { StoryData } from "src/app/forms/new-story/new-story.component";
import { Rate } from "../models/page";

export type Sort = 'title' | 'updatedAt' | 'rating';
export type SearchCriteria = {
    from: string,
    languages: string[],
    levels: string[],
    open: string;
}

const defaultSearchCriteria = {
    from: 'all',
    languages: [],
    levels: [],
    open: 'both',
}

@Injectable({
    providedIn: 'root'
})
export class StoryService {
    storyList = new BehaviorSubject<Story[]>([])
    searchCriteria: SearchCriteria = defaultSearchCriteria;
    sortBy: Sort = 'title';
    sortDirection: 1 | -1 = 1;
    storyName: string = '';

    constructor(private http: HttpClient) { }

    updateStoryList(): void {
        const body = { ...this.searchCriteria, sortBy: this.sortBy, sortDirection: this.sortDirection, storyName: this.storyName }
        this.http.post<{ status: string, stories: Story[] }>(`${environment.url}/stories/all`, body)
            .pipe(
                map(result => result.stories
                    .map(story => (
                        {
                            ...story,
                            updatedAt: moment.utc(story.updatedAt).local().startOf('seconds').fromNow()
                        }
                    ))
                )
            )
            .subscribe(stories => this.storyList.next(stories))
    }

    getStoryList(): Observable<Story[]> {
        return this.storyList.asObservable();
    }

    getStory(storyId:string){
        return this.http.get<{status:string, story:Story}>(`${environment.url}/stories/one/${storyId}`)
        .pipe(map(result=>result.story))
    }

    addStory(storyData: StoryData): void {
        const story = {
            title: storyData.title.trim(),
            description: storyData.description?.trim(),
            language: storyData.language,
            pageId: storyData.pageId,
            level: storyData.level,
            word1: storyData.word1?.toLowerCase().trim(),
            word2: storyData.word2?.toLowerCase().trim(),
            word3: storyData.word3?.toLowerCase().trim()
        };
        this.http.post<{ story: Story }>(`${environment.url}/stories/`, story)
            .subscribe(() => this.updateStoryList());
    }

    addPage(pageId:string, storyId:string, pageRatings:Rate[]){
       return this.http.put(`${environment.url}/stories/page`, { pageId, storyId, pageRatings })
    }

    removePendingPage(pageId:string, storyId:string){
       return this.http.put(`${environment.url}/stories/pendingPage`, { pageId, storyId})
    }

    changeSearchCriteria(sc: SearchCriteria): void {
        this.searchCriteria=sc;
        this.updateStoryList();
    }

    changeSort(value: Sort): void {
        if (this.sortBy === value) this.sortDirection *= -1;
        else this.sortBy = value;
        this.updateStoryList();
    }


    changeSearchTitle(): void {

    }
}