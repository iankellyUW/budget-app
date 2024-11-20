import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType, ChartData } from 'chart.js';

@Component({
  selector: 'app-rate-of-returns',
  templateUrl: './rate-of-returns.component.html',
  styleUrls: ['./rate-of-returns.component.scss']
})
export class RateOfReturnsComponent {

  formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  value: number = 0;
  startingBalance = 20000;
  expectedSavings = 10000;
  avgRateOfReturn = .07;
  startingYear = new Date().getFullYear();
  maxYears = this.startingYear + 60;


  lineChartData: ChartData<'line'> = {
      labels: this.calculateYears(), // X-axis labels
      datasets: [
        {
          data: this.calculateWealthOverTime(), // Y-axis data
          label: 'Money Over Time',
          borderColor: 'green', // Line color
          backgroundColor: 'rgba(178, 190, 181, 0.3)', // Fill color
        }
      ]
    };
  //Add Axis
  lineChartOptions = {
    responsive: true,
    scales: {
      x: {title: {display: true,text: 'Years'}},
      y: {title: {display: false,text: 'Wealth'}}}
    };

  // Chart type
  lineChartType: 'line' = 'line';

  //for printing stuff to logs
  //beepboop = this.calculateWealthOverTime();

  // Calculate wealth over time using the formula
  calculateWealthOverTime(): number[] {
    const years = this.maxYears - this.startingYear;
    const wealth: number[] = [];
    let currentBalance = this.startingBalance;

    for (let i = 1; i <= years; i++) {
        currentBalance += this.expectedSavings;
        currentBalance += (currentBalance * (1 + this.avgRateOfReturn));
        wealth.push(Math.round(currentBalance));
        console.log(`Year ${i}: ${Math.round(currentBalance)}`);
    }
    return wealth;
  }

  calculateYears(): number[] {
    const years: number[] = [];
    for (let year = this.startingYear; year <= this.maxYears; year++) {
      years.push(year)
    }
    return years;
  }

  // Update the chart when input values change
  updateChart(): void {
    this.lineChartData.datasets[0].data = this.calculateWealthOverTime();
  }

  constructor(private router: Router) {
  }

  switchPage(page: number): void {
      switch (page) {
        case 0: {
          this.router.navigateByUrl('');
          break;
        }
        case 1: {
          this.router.navigateByUrl('transactions');
          break;
        }
        case 2: {
            this.router.navigateByUrl('rate-of-returns');
            break;
        }
        default: {
          break;
        }
      }
    }

}
