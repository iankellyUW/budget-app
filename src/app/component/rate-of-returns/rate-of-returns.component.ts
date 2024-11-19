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
  startingBalance = 1000;

  public lineChartData: ChartData<'line'> = {
      labels: ['2025', '2026', '2027', '2028', '2029','2030', '2031', '2032', '2033', '2034', '2035'], // X-axis labels
      datasets: [
        {
          data: [this.startingBalance, this.startingBalance*1.07, this.startingBalance*1.07*1.07, this.startingBalance*1.07*1.07*1.07,
          this.startingBalance*1.07*1.07*1.07*1.07, this.startingBalance*1.07*1.07*1.07*1.07*1.07, this.startingBalance*1.07*1.07*1.07*1.07*1.07*1.07,
          this.startingBalance*1.07*1.07*1.07*1.07*1.07*1.07*1.07, this.startingBalance*1.07*1.07*1.07*1.07*1.07*1.07*1.07*1.07,
          this.startingBalance*1.07*1.07*1.07*1.07*1.07*1.07*1.07*1.07*1.07, this.startingBalance*1.07*1.07*1.07*1.07*1.07*1.07*1.07*1.07*1.07*1.07], // Y-axis data
          label: 'Money Over Time',
          borderColor: 'blue', // Line color
          backgroundColor: 'rgba(0, 0, 255, 0.3)', // Fill color
        }
      ]
    };

    // Chart options
    public lineChartOptions: ChartConfiguration<'line'>['options'] = {
      responsive: true,
      plugins: {
        legend: {
          display: true
        }
      }
    };

    // Chart type
    public lineChartType: 'line' = 'line';

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
