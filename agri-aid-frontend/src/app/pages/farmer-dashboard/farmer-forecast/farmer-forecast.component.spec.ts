import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerForecastComponent } from './farmer-forecast.component';

describe('FarmerForecastComponent', () => {
  let component: FarmerForecastComponent;
  let fixture: ComponentFixture<FarmerForecastComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FarmerForecastComponent]
    });
    fixture = TestBed.createComponent(FarmerForecastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
