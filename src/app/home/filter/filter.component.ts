import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Observable, startWith, map } from 'rxjs';
import { StoryService, SearchCriteria } from 'src/app/shared/services/story.service';
import languages from '../../../assets/languages.json';

type Language = {
  code: string,
  name: string;
}

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})

export class FilterComponent implements OnInit {
  showFilter: boolean = false;
  filterClosed: string = 'Filter🡇';
  filterOpen: string = 'Filter🡅';

  languageControl = new FormControl();
  languages: Language[] = languages;
  filteredLanguages!: Observable<Language[]>;
  selectedLanguages: string[] = [];

  levels: FormGroup;
  from:FormGroup;
  archived:FormGroup;

  constructor(private storyService: StoryService, private fb: FormBuilder) {

    this.levels = this.fb.group({
      name:  this.fb.array(['beginner', 'intermediate', 'advanced'])
    });
    this.from = this.fb.group({
     
    });
    this.archived = this.fb.group({
      yes:false,
      no:false,
      both:true,
    })
  }

  ngOnInit(): void {
    this.filteredLanguages = this.languageControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }

  onFilter(): void {
    this.showFilter = !this.showFilter;
  }

  onApply(): void {
    console.log(this.levels)
    const change: SearchCriteria = {
      from: 'all',
      open: 'both',
      languages: [],
      levels: [],

    }
    this.storyService.changeSearchCriteria(change)
    this.showFilter = !this.showFilter;
  }

  onSubmit(): void {}
  onClear(): void {
    this.selectedLanguages = [];
    this.levels.reset();
  }

  remove(language: string) {
    const index = this.selectedLanguages.indexOf(language);
    this.selectedLanguages.splice(index, 1);
  }

  selectOption(value: string) {
    if (this.selectedLanguages.indexOf(value) === -1) {
      this.selectedLanguages.push(value);
    }
    this.languageControl.setValue('');
  }

  private _filter(value: string): Language[] {
    const filterValue = value.toLowerCase();
    return this.languages.filter(language => language.name.toLowerCase().includes(filterValue));
  }

}
