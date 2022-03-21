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
  errorMessage: string = '';

  constructor(
    public dialogRef: MatDialogRef<NewPageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string[]) {
    this.words = data
      .filter(word => word !== null && word !==undefined)
      .map(word => ({ value: word, color: 'text-red' }))
  }


  changeText(event: any): void {
    const value = event.target.value as String;
    const allWordsChecked = this._checkWords(value.toLowerCase());
    if (value.length < 10) {
      this.errorMessage = "Minimum length is 10 characters"
    } else if (value.length > 280) {
      this.errorMessage = "Maximum length is 280 characters"
    } else {
      this.errorMessage = "";
    }
    this.validForm = allWordsChecked;
  }

  onSubmit(value:any){
    if(this.errorMessage!==''){
      alert(this.errorMessage);
    }else{
      this.dialogRef.close(value);
    }
  }

  private _checkWords(value: string): boolean {
    let result = true;
    this.words.forEach(word => {
      if (value.indexOf(word.value.toLowerCase()) > -1) {
        word.color = 'text-green';
      }else {
        word.color = 'text-red';
        result = false;
      }
    })
   
    return result;
  }

}