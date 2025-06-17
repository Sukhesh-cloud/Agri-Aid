// market-prices.component.ts
import { Component, OnInit } from '@angular/core';
import { MarketPriceService } from 'src/app/services/market-price.service';

interface MarketPrice {
  id?: string;
  crop: string;
  price: number;
  unit: string;
  trend: 'rising' | 'falling' | 'stable';
  changePercent?: number;
  lastUpdated?: Date;
  market?: string;
}

@Component({
  selector: 'app-market-prices',
  templateUrl: './market-prices.component.html',
  styleUrls: ['./market-prices.component.scss']
})
export class MarketPricesComponent implements OnInit {
  prices: MarketPrice[] = [];
  loading = true;
  error = false;
  errorMessage = '';
  searchTerm = '';
  sortBy = 'crop';
  sortDirection: 'asc' | 'desc' = 'asc';
  viewMode: 'table' | 'cards' = 'table';

  constructor(private priceService: MarketPriceService) {}

  ngOnInit(): void {
    this.loadPrices();
  }
  trackByFn(index: number, item: MarketPrice): string | number {
  return item.id || index;
}


  loadPrices(): void {
    this.loading = true;
    this.error = false;
    
    this.priceService.getPrices().subscribe({
      next: (data) => {
        this.prices = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch market prices', err);
        this.loading = false;
        this.error = true;
        this.errorMessage = 'Failed to load market prices. Please try again.';
      }
    });
  }

  getTrendIcon(trend: string): string {
    switch (trend) {
      case 'rising': return 'fas fa-arrow-up';
      case 'falling': return 'fas fa-arrow-down';
      case 'stable': return 'fas fa-minus';
      default: return 'fas fa-question';
    }
  }

  getTrendClass(trend: string): string {
    switch (trend) {
      case 'rising': return 'trend-up';
      case 'falling': return 'trend-down';
      case 'stable': return 'trend-stable';
      default: return '';
    }
  }

  get filteredPrices(): MarketPrice[] {
    let filtered = this.prices.filter(price => 
      price.crop.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      const aValue = a[this.sortBy as keyof MarketPrice];
      const bValue = b[this.sortBy as keyof MarketPrice];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return this.sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return this.sortDirection === 'asc' 
          ? aValue - bValue
          : bValue - aValue;
      }
      
      return 0;
    });
  }

  sortData(column: string): void {
    if (this.sortBy === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortDirection = 'asc';
    }
  }

  getSortIcon(column: string): string {
    if (this.sortBy !== column) return 'fas fa-sort';
    return this.sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
  }

  refresh(): void {
    this.loadPrices();
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'table' ? 'cards' : 'table';
  }
}