import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.css']
})
export class AuthorComponent implements OnInit {

  @Input()authorName!:string
  @Input()authorId!:string
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  onAuthor(event: MouseEvent): void {
    event.stopPropagation();
    if (this.authorName === 'Source') {
      window.location.href=this.authorId;
    }else{

    }
    this.router.navigate(['/stats'], { state: { authorId: this.authorId } })
  }
}