import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-new-words',
  templateUrl: './new-words.component.html',
  styleUrls: ['../style.css']
})
export class NewWordsComponent {

  constructor(
    public dialogRef: MatDialogRef<NewWordsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      word1: string,
      word2: string,
      word3: string
    }) { }

  onSubmit(): void {
    const { word1, word2, word3 } = this.data;
    if (word1 && word2 && word1.trim().length > 0 && word2.trim().length > 0) {
        this.dialogRef.close([word1, word2, word3]);
    } else {
      alert("Please enter at least 2 words");
    }
  }
}

