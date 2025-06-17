import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellStatusComponent } from './sell-status.component';

describe('SellStatusComponent', () => {
  let component: SellStatusComponent;
  let fixture: ComponentFixture<SellStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SellStatusComponent]
    });
    fixture = TestBed.createComponent(SellStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
