import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
type Word = {
  value: string;
  color: string;
  manuallyAllowed: boolean;
}
@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styleUrls: ['../style.css']
})
export class NewPageComponent {
  @ViewChild('input') input!: ElementRef;
  words: Word[];
  validForm = false;

  constructor(
    public dialogRef: MatDialogRef<NewPageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string[]) {
    this.words = data
      .filter(word => word !== null && word !== undefined)
      .map(word => ({ value: word, color: 'C', manuallyAllowed: false }))
  }


  changeText(event: any): void {
    if (event.target.value.substring(event.target.value.length - 2) === '  ') {
      this.input.nativeElement.value = event.target.value.substring(0, event.target.value.length - 1)
    } else {
      const value = event.target.value as String;
      this._checkWords(value.toLowerCase());
    }
  }

  onSubmit(value: any) {
    this.dialogRef.close(value);

  }
  clickWord(word: Word) {
    console.log(word);
    word.manuallyAllowed = !word.manuallyAllowed
    this._checkWords(this.input.nativeElement.value)
  }

  private _checkWords(value: string) {
    let result = true;
    this.words.forEach(word => {
      if (value.indexOf(word.value.toLowerCase()) > -1 || word.manuallyAllowed) {
        word.color = 'A';
      } else {
        word.color = 'C';
        result = false;
      }
    })
    this.validForm = result && value.length > 27 && value.length < 561;
  }

}
