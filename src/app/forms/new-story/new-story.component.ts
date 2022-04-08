import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LanguageModel,Level, languages } from 'src/app/shared/models/languageData';

export interface NewStoryData {
  title: string,
  description: string
  text: string,
  language: string,
  pageId: string,
  level: Level,
  word1: string,
  word2: string,
  word3: string,
}

@Component({
  selector: 'app-new-story',
  templateUrl: './new-story.component.html',
  styleUrls: ['../style.css']
})
export class NewStoryComponent {
  languages: LanguageModel[] = languages;
  constructor(
    public dialogRef: MatDialogRef<NewStoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NewStoryData) {}

}
