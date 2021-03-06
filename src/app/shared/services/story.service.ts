import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map, BehaviorSubject, Subject, tap } from "rxjs";
import { Story } from "../models/story";
import { environment } from '../../../environments/environment';
import moment from "moment";
import { NewStoryData } from "src/app/forms/new-story/new-story.component";
import { Rate } from "../models/page";
import { LanguageModel } from "../models/languageData";

export type Sort = 'title' | 'updatedAt' | 'ratingAvg';
export type SearchCriteria = {
    from: string,
    languages: LanguageModel[],
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
    story = new Subject<Story>()
    searchCriteria: SearchCriteria = defaultSearchCriteria;
    sortBy: Sort = 'updatedAt';
    sortDirection: 1 | -1 = -1;
    storyName: string = '';

    constructor(private http: HttpClient) { }

    updateStoryList(): void {
        const languages = this.searchCriteria.languages.map(language => language.text);
        const body = { ...this.searchCriteria, sortBy: this.sortBy, sortDirection: this.sortDirection, storyName: this.storyName, languages }
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

    updateStory(storyId: string): void {
        this.http.get<{ status: string, story: Story }>(`${environment.url}/stories/one/${storyId}`)
            .subscribe(result => {
                this.story.next(result.story);
            })
    }

    getSearchCriteria() {
        return this.searchCriteria;
    }

    getStory() {
        return this.story.asObservable();
    }

    getStoryData(authorId: string) {
        return this.http.get<{ status: string, size: number, upVotes: number, totalVotes: number }>(`${environment.url}/stories/many/${authorId}`)
    }

    getDaily() {
        return this.http.get<{ status: string, story: Story, hoursLeft: number, minutesLeft: number }>(`${environment.url}/stories/tribute/data`)
            .pipe(map(data => {
                const result = {
                    hoursLeft: Math.ceil(data.hoursLeft), minutesLeft: Math.ceil(data.minutesLeft),
                    story: data.story ? { ...data.story, updatedAt: moment.utc(data.story.updatedAt).local().startOf('seconds').fromNow() } : null
                };
                return result;
            }));
    }

    addStory(storyData: NewStoryData) {
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
        return this.http.post<{ status: string, storyId: string }>(`${environment.url}/stories/`, story)
            .pipe(map(result => {
                this.updateStoryList();
                return result.storyId;
            }));
    }

    addPage(pageId: string, storyId: string, pageRatings: Rate[], authorId: string) {
        return this.http.put(`${environment.url}/stories/page`, { pageId, storyId, pageRatings, authorId })
    }

    addPendingPage(pageId: string, storyId: string) {
        this.http.post<{ status: string, story: Story }>(`${environment.url}/stories/pendingPage`, { pageId, storyId })
            .subscribe(result => this.story.next(result.story))
    }

    addWords(storyId: string, word1: string, word2: string, word3: string) {
        this.http.put<{ status: string, story: Story }>(`${environment.url}/stories/`, { storyId, word1, word2, word3 })
            .subscribe(result => this.story.next(result.story))
    }

    archiveStory(id:string,open: boolean) {
        this.http.patch<{ status: string, story: Story }>(`${environment.url}/stories/one/${id}`, { open })
            .subscribe(result => this.story.next(result.story))

    }

    editStory(id: string, title: string, description: string) {
        this.http.put<{ status: string, story: Story }>(`${environment.url}/stories/one/${id}`, { title, description })
            .subscribe(result => this.story.next(result.story));
    }
    deleteStories() {
        return this.http.delete(`${environment.url}/stories/all/`);
    }

    rateLevel(storyId: string, rate: string): void {
        this.http.put<{ status: string, story: Story }>(`${environment.url}/stories/level`, { rate, storyId })
            .subscribe(result => this.story.next(result.story));
    }

    rateText(storyId: string, vote: number): void {
        this.http.put(`${environment.url}/stories/rate`, { vote, storyId })
            .subscribe(() => { })
    }

    removePendingPage(pageId: string, storyId: string) {
        return this.http.put(`${environment.url}/stories/pendingPage`, { pageId, storyId })
    }

    changeSearchCriteria(sc?: SearchCriteria): void {
        if (sc) {
            this.searchCriteria = sc;

        } else {
            this.searchCriteria = {
                from: 'all',
                languages: [],
                levels: [],
                open: 'both',
            }
        }
        this.updateStoryList();
    }

    changeSort(value: Sort): void {
        if (this.sortBy === value) this.sortDirection *= -1;
        else this.sortBy = value;
        this.updateStoryList();
    }


    changeSearchTitle(title: string): void {
        this.storyName = title;
        this.updateStoryList();
    }
}