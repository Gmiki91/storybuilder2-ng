import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styleUrls: ['../style.css']
})
export class NewPageComponent {
  words: {
    value: string;
    color: string;
  }[];
  validForm = false;

  constructor(
    public dialogRef: MatDialogRef<NewPageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string[]) {
    this.words = data
      .filter(word => word !== null && word !== undefined)
      .map(word => ({ value: word, color: 'C' }))
  }


  changeText(event: any): void {
    const value = event.target.value as String;
    const allWordsChecked = this._checkWords(value.toLowerCase());
    this.validForm = allWordsChecked && value.length>9 && value.length<281;
  }

  onSubmit(value: any) {
    this.dialogRef.close(value);

  }

  private _checkWords(value: string): boolean {
    let result = true;
    this.words.forEach(word => {
      if (value.indexOf(word.value.toLowerCase()) > -1) {
        word.color = 'A';
      } else {
        word.color = 'C';
        result = false;
      }
    })

    return result;
  }

}
