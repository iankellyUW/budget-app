import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BudgetMainComponent } from './component/budget-main/budget-main.component';
import { NgChartsModule } from 'ng2-charts';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { TransactionMainDialog, TransactionsMainComponent } from './component/transactions-main/transactions-main.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RateOfReturnsComponent } from './component/rate-of-returns/rate-of-returns.component';
import { BuyingVsRentingComponent } from './component/buying-vs-renting/buying-vs-renting.component';


@NgModule({
  declarations: [
    AppComponent,
    BudgetMainComponent,
    TransactionsMainComponent,
    TransactionMainDialog,
    RateOfReturnsComponent,
    BuyingVsRentingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgChartsModule,
    MatSlideToggleModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatMenuModule,
    MatFormFieldModule,
    MatGridListModule,
    CurrencyMaskModule,
    FormsModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
  ],
  exports: [
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ]
})

export class AppModule { }
