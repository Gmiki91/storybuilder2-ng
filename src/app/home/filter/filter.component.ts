import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Observable, startWith, map } from 'rxjs';
import { Language } from 'src/app/shared/models/languageData';
import { StoryService, SearchCriteria } from 'src/app/shared/services/story.service';
import languages from '../../../assets/languages.json';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})

export class FilterComponent implements OnInit {

  @Output() closeFilter: EventEmitter<boolean> = new EventEmitter(false)

  languageControl = new FormControl();
  languages: Language[] = languages;
  filteredLanguages!: Observable<Language[]>;
  selectedLanguages: string[] = [];

  filterForm: FormGroup;

  constructor(private storyService: StoryService, private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      levels: this.fb.array([]),
      from: new FormControl('all'),
      open: new FormControl('both')
    });

  }

  ngOnInit(): void {
    this.filteredLanguages = this.languageControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }

  onCheckboxChange(e: any) {
    const checkArray: FormArray = this.filterForm.get('levels') as FormArray;
    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      const index = checkArray.controls.findIndex(x => x.value === e.target.value);
      checkArray.removeAt(index);
    }
  }
  isCheckboxChecked(value: string): boolean {
    const checkArray: FormArray = this.filterForm.get('levels') as FormArray;
    return checkArray.value.indexOf(value) > -1;
  }

  onFromChange(e: any) {
    this.filterForm.controls['from'].setValue(e.target.value);
  }

  onOpenChange(e: any) {
    this.filterForm.controls['open'].setValue(e.target.value);
  }

  onApply(): void {
    const change: SearchCriteria = {
      languages: this.selectedLanguages,
      from: this.filterForm.controls['from'].value,
      open: this.filterForm.controls['open'].value,
      levels: this.filterForm.controls['levels'].value,

    }
    this.storyService.changeSearchCriteria(change)
    this.closeFilter.emit(true);
  }

  onClear(): void {
    this.selectedLanguages = [];
    this.closeFilter.emit(true);
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
