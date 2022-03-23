import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Note } from 'src/app/shared/models/note';
import { NoteService } from 'src/app/shared/services/note.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {

  notes$!: Observable<Note[]>
  constructor(
    private noteService: NoteService,
    private router:Router
    ) { }

  ngOnInit(): void {
    this.notes$=this.noteService.getNotes()
  }

  onStoryClicked(storyId:string): void {
    this.router.navigate(['/story'], { state: { storyId } })
  }

}
