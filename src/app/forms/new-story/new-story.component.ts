import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
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
  @ViewChild('titleText') title!:ElementRef;
  @ViewChild('pageText') text!:ElementRef;
  languages: LanguageModel[] = languages;
  constructor(
    public dialogRef: MatDialogRef<NewStoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NewStoryData) {}

    changeText(event: any):void {
      if (event.target.value.substring(event.target.value.length - 2) === '  ') 
        this.text.nativeElement.value = event.target.value.substring(0,event.target.value.length - 1)
    
    }
    changeTitle(event: any):void {
      if (event.target.value.substring(event.target.value.length - 2) === '  ') 
        this.title.nativeElement.value = event.target.value.substring(0,event.target.value.length - 2)
    
    }
}
