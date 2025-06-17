import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { FarmerDashboardComponent } from './pages/farmer-dashboard/farmer-dashboard.component';
import { SellerDashboardComponent } from './pages/seller-dashboard/seller-dashboard.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { DiseaseDetectionComponent } from './pages/farmer-dashboard/disease-detection/disease-detection.component';
import { PesticideInfoCardComponent } from './pages/farmer-dashboard/pesticide-info-card/pesticide-info-card.component';
import { FarmerForecastComponent } from './pages/farmer-dashboard/farmer-forecast/farmer-forecast.component';
import { SellStatusComponent } from './pages/farmer-dashboard/sell-status/sell-status.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MarketPricesComponent } from './pages/farmer-dashboard/market-prices/market-prices.component';
import { QuerySummaryComponent } from './pages/farmer-dashboard/query-summary/query-summary.component';
import { Nl2brPipe } from './nl2br.pipe';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    FarmerDashboardComponent,
    SellerDashboardComponent,
    DiseaseDetectionComponent,
    PesticideInfoCardComponent,
    FarmerForecastComponent,
    SellStatusComponent,
    MarketPricesComponent,
    QuerySummaryComponent,
    Nl2brPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
