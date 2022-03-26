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
    noteList = new BehaviorSubject<Note[]>([])
    constructor(private http: HttpClient) { }

    getNotes() {
        return this.http.get<{ status: string, notifications: Note[] }>(`${environment.url}/notifications`)
            .pipe(map(result => result.notifications
                .map(note => ({ ...note, date: moment.utc(note.date).local().startOf('seconds').fromNow() }))
            ))
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
