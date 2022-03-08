import { Component,  OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Page } from '../shared/models/page';
import { Story } from '../shared/models/story';
import { PageService } from '../shared/services/page.service';

type PageType = 'Confirmed' | 'Pending';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.css']
})
export class StoryComponent implements OnInit {
  
  story!: Story;
  pageList$!: Observable<Page[]>;
  toggleTypeLabel:PageType = 'Pending';
  hideToggle:boolean = true;
  
  constructor(private router: Router, private pageService: PageService) {
    let nav = this.router.getCurrentNavigation();
    if (nav?.extras.state)
      this.story = nav.extras.state['story'] as Story;
  }

  ngOnInit(): void {
    this.getPages('Confirmed');
    this.hideToggle = this.story.pendingPageIds.length===0;
  }

  getPages(type:PageType):void{
    const ids = type === 'Confirmed' ? 'pageIds' : 'pendingPageIds';
    this.toggleTypeLabel = type === 'Confirmed' ? 'Pending' : 'Confirmed';
    this.pageList$ = this.pageService.getPageList();
    this.pageService.updatePageList(this.story[ids]);
  }

}
