import { Component,  OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { Story } from '../shared/models/story';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.css']
})
export class StoryComponent implements OnInit {

  story!: Story;
  constructor(private router: Router) {
    let nav = this.router.getCurrentNavigation();
    if (nav?.extras.state)
      this.story = nav.extras.state['story'] as Story;
  }

  ngOnInit(): void {
  }

}
