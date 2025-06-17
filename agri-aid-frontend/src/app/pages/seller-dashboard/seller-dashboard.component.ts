import { Component, OnInit } from '@angular/core';
import { CropSaleService } from 'src/app/services/crop-sale.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-seller-dashboard',
  templateUrl: './seller-dashboard.component.html',
  styleUrls: ['./seller-dashboard.component.scss']
})
export class SellerDashboardComponent implements OnInit {
  pendingSales: any[] = [];
  loading = true;
  sellerId: string = '';
  message: string = '';

  constructor(
    private cropSaleService: CropSaleService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const payload = this.authService.getTokenPayload();
    if (payload && payload.id) {
      this.sellerId = payload.id;
      this.loadPendingSales();
    }
  }

  loadPendingSales() {
    this.cropSaleService.getPendingSales().subscribe({
      next: (data) => {
        this.pendingSales = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading sales:', err);
        this.loading = false;
      }
    });
  }

  respond(saleId: string, action: 'accepted' | 'rejected') {
    this.cropSaleService.respondToSale(saleId, {
      status: action,
      sellerId: this.sellerId
    }).subscribe({
      next: () => {
        this.message = `Crop ${action === 'accepted' ? 'accepted' : 'rejected'} successfully!`;
        this.loadPendingSales(); // refresh after action
      },
      error: (err) => {
        console.error('Error responding to sale:', err);
      }
    });
  }
}
