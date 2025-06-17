import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { FarmerDashboardComponent } from './pages/farmer-dashboard/farmer-dashboard.component';
import { SellerDashboardComponent } from './pages/seller-dashboard/seller-dashboard.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { DiseaseDetectionComponent } from './pages/farmer-dashboard/disease-detection/disease-detection.component';
import { PesticideInfoCardComponent } from './pages/farmer-dashboard/pesticide-info-card/pesticide-info-card.component';
import { FarmerForecastComponent } from './pages/farmer-dashboard/farmer-forecast/farmer-forecast.component';
import { SellStatusComponent } from './pages/farmer-dashboard/sell-status/sell-status.component';
import { MarketPricesComponent } from './pages/farmer-dashboard/market-prices/market-prices.component';
import { QuerySummaryComponent } from './pages/farmer-dashboard/query-summary/query-summary.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'farmer-dashboard',
    component: FarmerDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'farmer' }
  },
  {
    path: 'seller-dashboard',
    component: SellerDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'seller' }
  },
  { path: 'farmer/disease-detection', component: DiseaseDetectionComponent },
   { path: 'farmer/pesticide-info', component: PesticideInfoCardComponent },
   { path: 'farmer/forecast', component: FarmerForecastComponent },
   {path:'farmer/market-prices',component:MarketPricesComponent},
   {path: 'farmer/sell-status', component: SellStatusComponent },
  {path:'farmer/query-summary', component: QuerySummaryComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

