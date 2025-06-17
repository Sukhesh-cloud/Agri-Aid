import { Component, OnInit } from '@angular/core';
import { CropSaleService } from 'src/app/services/crop-sale.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sell-status',
  templateUrl: './sell-status.component.html',
  styleUrls: ['./sell-status.component.scss']
})
export class SellStatusComponent implements OnInit {
  saleForm!: FormGroup;
  sales: any[] = [];
  loading = true;
  error = '';
  successMessage = '';

  constructor(
    private cropSaleService: CropSaleService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    const payload = this.authService.getTokenPayload();
    if (payload && payload.id) {
      this.loadSales(payload.id);
    } else {
      this.error = 'Invalid session.';
    }
  }

  initForm() {
    this.saleForm = this.fb.group({
      cropName: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      pricePerUnit: ['', [Validators.required, Validators.min(0)]]
    });
  }

  loadSales(farmerId: string) {
    this.cropSaleService.getFarmerSales(farmerId).subscribe({
      next: (data) => {
        this.sales = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading sales:', err);
        this.error = 'Failed to load crop sale records.';
        this.loading = false;
      }
    });
  }

  postCrop() {
    if (this.saleForm.invalid) return;

    const payload = this.authService.getTokenPayload();
    const formData = {
      ...this.saleForm.value,
      farmerId: payload.id
    };

    this.cropSaleService.createSale(formData).subscribe({
      next: (res) => {
        this.successMessage = 'Crop posted successfully!';
        this.saleForm.reset();
        this.loadSales(payload.id); // reload table
      },
      error: (err) => {
        console.error('Failed to post crop:', err);
        this.error = 'Failed to post crop for sale.';
      }
    });
  }

  getStatusClass(status: string): string {
    return {
      'pending': 'badge bg-warning text-dark',
      'accepted': 'badge bg-success',
      'rejected': 'badge bg-danger',
      'sold': 'badge bg-primary'
    }[status] || 'badge bg-secondary';
  }
}
