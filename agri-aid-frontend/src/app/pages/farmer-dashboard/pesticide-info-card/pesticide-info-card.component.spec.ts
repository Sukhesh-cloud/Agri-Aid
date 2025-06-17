import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PesticideInfoCardComponent } from './pesticide-info-card.component';

describe('PesticideInfoCardComponent', () => {
  let component: PesticideInfoCardComponent;
  let fixture: ComponentFixture<PesticideInfoCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PesticideInfoCardComponent]
    });
    fixture = TestBed.createComponent(PesticideInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
