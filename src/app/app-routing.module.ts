import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BudgetMainComponent } from './component/budget-main/budget-main.component';
import { TransactionsMainComponent } from './component/transactions-main/transactions-main.component'

const routes: Routes = [
  { path:'', component: BudgetMainComponent},
  { path:'transactions', component: TransactionsMainComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
