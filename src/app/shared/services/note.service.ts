import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import moment from "moment";
import { BehaviorSubject, map } from "rxjs";
import { environment } from "src/environments/environment";
import { Note } from "../models/note";

@Injectable({
    providedIn: 'root'
})
export class NoteService {
    news = new BehaviorSubject<boolean>(false)
    constructor(private http: HttpClient) { }

    getNotes() {
        return this.http.get<{ status: string, notifications: Note[] }>(`${environment.url}/notifications`)
            .pipe(map(result => {
                this.news.next(false);
                return result.notifications
                    .map(note => ({ ...note, date: moment.utc(note.date).local().startOf('seconds').fromNow() }))
            }))
    }
    checkNewNotes() {
        this.http.get<{ status: string, notes: number }>(`${environment.url}/notifications/check`).subscribe(result => this.news.next(result.notes>0))
    }

    isNews() {
        return this.news.asObservable();
    }

    addNotes(userIds: string, note: Note) {
        this.http.post(`${environment.url}/notifications/${userIds}`, { note })
            .subscribe(() => { })
    }

    addSelfNote(note: Note) {
        this.http.post(`${environment.url}/notifications/`, { note })
            .subscribe(() => { this.getNotes() })
    }
}
