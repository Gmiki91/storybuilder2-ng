import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Story } from 'src/app/shared/models/story';

@Component({
  selector: 'app-edit-story',
  templateUrl: './edit-story.component.html',
  styleUrls: ['../style.css']
})
export class EditStoryComponent {
  @ViewChild('description') description!: ElementRef;
  editLabel: string = "Edit";
  edit: boolean = false;
  story: Story;
  ownStory:boolean;
  constructor(
    public dialogRef: MatDialogRef<EditStoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {story:Story, userId:string}) {
    this.story = data.story;
    this.ownStory = data.story.authorId === data.userId;
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onEdit(): void {
    if (this.edit) {
      this.edit = false;
      this.story.description = this.description.nativeElement.value;
      this.editLabel = "Edit";
    } else {
      this.edit = true;
      this.editLabel = "Done";
    }
  }
}
