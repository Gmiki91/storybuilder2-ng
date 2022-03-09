import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Language } from 'src/app/shared/models/languageData';
import { LevelCode } from 'src/app/shared/models/LanguageLevels';
import languages from '../../../assets/languages.json';

export interface StoryData {
  title: string,
  description: string
  text: string,
  language: string,
  pageId: string,
  level: LevelCode,
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
