import { Component, Directive, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType, Legend } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-budget-main',
  templateUrl: './budget-main.component.html',
  styleUrls: ['./budget-main.component.scss']
})
export class BudgetMainComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  value:number = 7000;
  startingBalance = 7000;
  endingBalance = 8051;
  totalSavingsIncrease = 15;
  totalSavedMonth:string = '';

  title = 'ng2-charts-demo';

  public barChartLegend = false;
  public barChartPlugins = [
  ];

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [ 'Start Balance: ' + this.formatter.format(this.startingBalance), 'End Balance: ' + this.formatter.format(this.endingBalance)],
    datasets: [
      { data: [ 7000, 8051 ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(75, 192, 192, 0.2)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(75, 192, 192)',
        ],
        borderWidth: 1},
    ]
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    }
  };

  constructor() {
  }

  ngOnInit(): void {
    let saved = this.endingBalance - this.startingBalance;
    this.totalSavedMonth = this.formatter.format(saved);
  }
}
