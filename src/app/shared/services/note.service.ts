import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import moment from "moment";
import {  map } from "rxjs";
import { environment } from "src/environments/environment";
import { Note } from "../models/note";

@Injectable({
    providedIn: 'root'
})
export class NoteService {
    constructor(private http: HttpClient) { }

    getNotes() {
        return this.http.get<{ status: string, notifications: Note[] }>(`${environment.url}/notifications`)
            .pipe(map(result => {
                return result.notifications
                    .map(note => ({ ...note, date: moment.utc(note.date).local().startOf('seconds').fromNow() }))
            }))
    }

    addNotes(userIds: string, note: Note) {
        note.unseen = true;
        this.http.post(`${environment.url}/notifications/${userIds}`, { note })
            .subscribe(() => { })
    }

    addSelfNote(note: Note) {
        note.unseen = false;
        this.http.post(`${environment.url}/notifications/`, { note })
            .subscribe(() => { this.getNotes() })
    }
}
