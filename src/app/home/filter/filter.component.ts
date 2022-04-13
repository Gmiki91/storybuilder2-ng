import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Observable, startWith, map } from 'rxjs';
import { LanguageModel, languages } from 'src/app/shared/models/languageData';
import { StoryService, SearchCriteria } from 'src/app/shared/services/story.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})

export class FilterComponent implements OnInit {

  @Output() closeFilter: EventEmitter<boolean> = new EventEmitter(false)

  languageControl = new FormControl();
  languages: LanguageModel[] = languages;
  filteredLanguages!: Observable<LanguageModel[]>;
  selectedLanguages: LanguageModel[] = [];
  default: SearchCriteria;
  filterForm: FormGroup;

  constructor(private storyService: StoryService, private fb: FormBuilder) {
    this.default = this.storyService.getSearchCriteria();
    this.selectedLanguages = this.default.languages;
    this.filterForm = this.fb.group({
      levels: this.fb.array(this.default.levels),
      from: new FormControl(this.default.from),
      open: new FormControl(this.default.open)
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
  isCheckboxChecked(arr: string, value: string): boolean {
    const checkArray: FormArray = this.filterForm.get(arr) as FormArray;
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
    this.storyService.changeSearchCriteria();
    this.selectedLanguages.splice(0,this.selectedLanguages.length);
    this.closeFilter.emit(true);
  }

  remove(language: LanguageModel) {
    const index = this.selectedLanguages.indexOf(language);
    this.selectedLanguages.splice(index, 1);
  }

  selectOption(value: LanguageModel) {
    if (this.selectedLanguages.indexOf(value) === -1) {
      this.selectedLanguages.push(value);
    }
    this.languageControl.setValue('');
  }

  private _filter(value: LanguageModel): LanguageModel[] {
    if (value) {
      const filterValue = value.text.toLowerCase();
      return this.languages.filter(language => language.text.toLowerCase().includes(filterValue));
    } else {
      return this.languages;
    }
  }
}
