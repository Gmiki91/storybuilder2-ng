import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Level, levels } from 'src/app/shared/models/languageData';

@Component({
  selector: 'app-rate-level',
  templateUrl: './rate-level.component.html',
  styleUrls: ['../style.css']
})
export class RateLevelComponent {

  options:Level[];
  level: Level;
  constructor(
    public dialogRef: MatDialogRef<RateLevelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Level) {
      this.level=data;
      this.options = levels.filter(level => level.code!==data.code);
    }

    onClose(): void {
      this.dialogRef.close();
    }

}
