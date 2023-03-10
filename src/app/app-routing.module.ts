import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BudgetMainComponent } from './component/budget-main/budget-main.component';

const routes: Routes = [
  { path:'', component: BudgetMainComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
