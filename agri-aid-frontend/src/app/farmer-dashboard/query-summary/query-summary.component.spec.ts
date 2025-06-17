import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuerySummaryComponent } from './query-summary.component';

describe('QuerySummaryComponent', () => {
  let component: QuerySummaryComponent;
  let fixture: ComponentFixture<QuerySummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuerySummaryComponent]
    });
    fixture = TestBed.createComponent(QuerySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
