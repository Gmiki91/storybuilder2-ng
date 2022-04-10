import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['../style.css']
})
export class AuthorComponent implements OnInit {

  @Input() authorName!: string
  @Input() authorId!: string
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  onAuthor(event: MouseEvent): void {
    event.stopPropagation();
    window.location.href = this.authorId;
    this.router.navigate(['/stats'], { state: { authorId: this.authorId } })
  }
}
