import { TestBed } from '@angular/core/testing';

import { CropSaleService } from './crop-sale.service';

describe('CropSaleService', () => {
  let service: CropSaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CropSaleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
