import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BudgetMainComponent } from './component/budget-main/budget-main.component';
import { TransactionsMainComponent } from './component/transactions-main/transactions-main.component'
import { RateOfReturnsComponent } from './component/rate-of-returns/rate-of-returns.component'

const routes: Routes = [
  { path:'', component: BudgetMainComponent},
  { path:'transactions', component: TransactionsMainComponent },
  { path: 'rate-of-returns', component: RateOfReturnsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
