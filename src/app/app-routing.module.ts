import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BudgetMainComponent } from './component/budget-main/budget-main.component';
import { TransactionsMainComponent } from './component/transactions-main/transactions-main.component'
import { RateOfReturnsComponent } from './component/rate-of-returns/rate-of-returns.component'
import { BuyingVsRentingComponent } from './component/buying-vs-renting/buying-vs-renting.component'

const routes: Routes = [
  { path:'', component: BudgetMainComponent},
  { path:'transactions', component: TransactionsMainComponent },
  { path: 'rate-of-returns', component: RateOfReturnsComponent },
  { path: 'buying-vs-renting', component: BuyingVsRentingComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
