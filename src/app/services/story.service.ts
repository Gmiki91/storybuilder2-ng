import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map, BehaviorSubject } from "rxjs";
import { Story } from "../models/story";
import { environment } from '../../environments/environment';
import * as moment from "moment";

export type Sort =  'title' | 'updatedAt' | 'rating';
type SearchCriteria = {
    storyName: string,
    from: string,
    languages: string[],
    levels: string[],
    open: string;
}
const defaultSearchCriteria = {
    storyName: '',
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
    searchTitle: string = '';

    constructor(private httpClient: HttpClient) { }

    updateStoryList(): void {
        const body = { ...this.searchCriteria, sortBy: this.sortBy, sortDirection: this.sortDirection, searchTitle: this.searchTitle }
        this.httpClient.post<{ status: string, stories: Story[] }>(`${environment.url}/stories/all`, body)
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
            .subscribe(stories=>this.storyList.next(stories))
    }
    
    getStoryList():Observable<Story[]>{
        return this.storyList.asObservable();
    }
    changeSearchCriteria(): void {

    }

    changeSort(value:Sort): void {
        if(this.sortBy===value) this.sortDirection *= -1;
        else this.sortBy=value;
        this.updateStoryList();
    }


    changeSearchTitle(): void {

    }
}