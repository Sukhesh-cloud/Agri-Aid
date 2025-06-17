import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiseaseDetectionComponent } from './disease-detection.component';

describe('DiseaseDetectionComponent', () => {
  let component: DiseaseDetectionComponent;
  let fixture: ComponentFixture<DiseaseDetectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiseaseDetectionComponent]
    });
    fixture = TestBed.createComponent(DiseaseDetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
