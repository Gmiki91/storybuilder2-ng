import { Directive, ElementRef, Input, OnInit } from '@angular/core';

const rtlLanguages = ['Arabic', 'Persian', 'Hebrew', 'Yiddish']
@Directive({
  selector: '[textDirection]'
})
export class DirectionDirective implements OnInit {
  @Input('textDirection') code!: string;

  constructor(private el: ElementRef) {}
  ngOnInit(): void {
    this.el.nativeElement.style.direction = rtlLanguages.indexOf(this.code) === -1 ? 'ltr' : 'rtl';
  }

}
