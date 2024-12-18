import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType, ChartData } from 'chart.js';
import { ChangeDetectorRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-rate-of-returns',
  templateUrl: './rate-of-returns.component.html',
  styleUrls: ['./rate-of-returns.component.scss']
})
export class RateOfReturnsComponent {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective; // This will get a reference to the chart

  formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  //=========parameters the user can change=============
  value: number = 0;
  age = 24;
  maxYears = 30;
  startingBalance = 1000000;
  expectedInvestmentsThisYear = 1000000;
  avgRateOfReturn = .07;
  //Education level and additional certifications (TO BE ADDED)
  avgSalaryGrowth = .20

  //---------Expenses----------
  avgExpensesGrowth =.025 //(inflation + increased lifestyle)

  //Rent
  monthlyRent = 2000;
  rentGrowthRate = 0.03;

  //----------------Advanced------------------
  //Economic conditions
  //industry and company growth
  //=========End of editable parameters============

  //===============Fixed Variables based off of advanced options of user or default in ()==============
  //salary growth through entry level job (10-20%, first 5 years)

  //salary growth in mid level stage (3-8%, next 5 - 15 years)

  //salary growth in senior level, (tough to calculate due to additional income opportunities, late 40s - mid 50s)

  //salary platues, (60s)

  //Housing costs, Family expenses, Health care costs
  //Early Adult Phase (18-25)

  //Young Professional Phase (25-35)

  //Family Formation Phase (30-45)

  //Senior Phase (65+)

  graphVariables: {yearRange: number[]; low: number[]; high: number[], avg: number []} = this.calculateReturns(this.avgRateOfReturn,this.startingBalance,.15);

  lineChartData: ChartData<'line'> = {
      labels: this.graphVariables.yearRange, // X-axis labels
      datasets: [
        {
          data: this.graphVariables.avg, // Y-axis data
          label: 'Average Returns',
          borderColor: 'rgb(0,150,0)', // Line color
          backgroundColor: 'rgba(0, 150, 0, 1)', // Fill color
          pointRadius: 0,

        },
        {
          data: this.graphVariables.low,
          label: 'Low End STD',
          borderColor: 'rgb(169,210,169)',
          backgroundColor: 'rgba(169,210,169, 0.8)',
          pointRadius: 0,
          borderDash: [8, 5]
        },
        {
          data: this.graphVariables.high,
          label: 'High End STD',
          borderColor: 'rgb(169,210,169)',
          backgroundColor: 'rgba(169,210,169, 0.8)',
          pointRadius: 0,
          borderDash: [8, 5]
        }
      ]
    };
  //Add Axis
  lineChartOptions = {
    responsive: true,
    scales: {
      x: {title: {display: true,text: 'Age'}},
      y: {title: {display: false,text: 'Wealth'}}}
    };

  // Chart type
  lineChartType: 'line' = 'line';

  //-----------------for printing stuff to logs--------------------
  //beepboop: {yearRange: number[]; low: number[]; high: number[], avg: number []} = this.calculateReturns(this.avgRateOfReturn,this.startingBalance,.15);

  calculateReturns(averageReturn: number,initialInvestment: number, stdDeviation: number): {yearRange: number[], low: number[], high: number[], avg: number[]} {
    const lowReturns: number [] = [];
    const highReturns: number [] = [];
    const avgReturns: number [] = [];
    const years : number[] = [];
    let margin = stdDeviation;

    years.push(this.age)
    avgReturns.push(initialInvestment)
    lowReturns.push(initialInvestment)
    highReturns.push(initialInvestment)

    for (let year = 1; year <= this.maxYears; year++) {
        const avgReturn = Math.round(((avgReturns[year - 1] * (1+averageReturn)) + this.expectedInvestmentsThisYear) * 100) / 100;
        const lowReturn = Math.round(((lowReturns[year -1] * (1+averageReturn - margin)) + this.expectedInvestmentsThisYear) * 100) / 100;
        const highReturn = Math.round(((highReturns[year - 1] * (1+averageReturn + margin)) + this.expectedInvestmentsThisYear) * 100) / 100; //figure it out!

        years.push(this.age+year);
        avgReturns.push(avgReturn);
        lowReturns.push(lowReturn);
        highReturns.push(highReturn);

        console.log("year: " + year);
        console.log("avg: " + avgReturn);
        console.log("low: " + lowReturn);
        console.log("high: " + highReturn);
        console.log("margin: " + margin)

        margin = Math.round((stdDeviation / (Math.sqrt(year)))*1000)/1000;
     }
     return {yearRange: years, low: lowReturns, high: highReturns, avg: avgReturns };
   }

  // Update the chart when input values change
  updateChart(): void {
    this.graphVariables = this.calculateReturns(this.avgRateOfReturn, this.startingBalance, .15);
    console.log("updateChart triggered ")

    // Update labels
    this.lineChartData.labels = this.graphVariables.yearRange;

    // Update datasets in correct order
    this.lineChartData.datasets[0].data = this.graphVariables.avg;
    this.lineChartData.datasets[1].data = this.graphVariables.low;
    this.lineChartData.datasets[2].data = this.graphVariables.high;

    this.cdRef.detectChanges();
    if (this.chart?.chart){
      this.chart.chart.update();
    }
  }

  constructor(private router: Router, private cdRef: ChangeDetectorRef) {}

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
      case 3: {
          this.router.navigateByUrl('buying-vs-renting');
          break;
      }
      default: {
          break;
      }
    }
  }
}
