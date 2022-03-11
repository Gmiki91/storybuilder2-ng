import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Language,Level } from 'src/app/shared/models/languageData';
import languages from '../../../assets/languages.json';

export interface StoryData {
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
  languages: Language[] = languages;
  constructor(
    public dialogRef: MatDialogRef<NewStoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StoryData) {}

}
