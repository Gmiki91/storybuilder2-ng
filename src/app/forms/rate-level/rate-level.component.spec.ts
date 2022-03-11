import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateLevelComponent } from './rate-level.component';

describe('RateLevelComponent', () => {
  let component: RateLevelComponent;
  let fixture: ComponentFixture<RateLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RateLevelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RateLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
