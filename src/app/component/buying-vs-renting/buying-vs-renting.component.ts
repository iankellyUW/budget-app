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
  selector: 'app-buying-vs-renting',
  templateUrl: './buying-vs-renting.component.html',
  styleUrls: ['./buying-vs-renting.component.scss']
})
export class BuyingVsRentingComponent {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  // Time Variables
  age = 24;
  mortgageYears = 15;

  // Savings variables
  startingBalance = 40000;
  expectedInvestmentsThisYear = 20000;
  avgRateOfReturn = .07;
  avgSalaryGrowth = .0020;
  rateOfInflation = .025;

  // Housing variables
  housePrice = 1000000;
  downPaymentPercent = 0.20;
  // Growth
  homeAppreciationRate = 0.00;
  // Housing Expenses
  maintenanceRate = 0.01;
  propertyTaxRate = 0.01;
  mortgageRate = 0.065;
  insuranceRate = 0.005;
  housingStandardDeviation = .03;
  taxRate = .25; //Marginal tax rate for deductions
  // One time costs
  closingCostRate = .03;
  sellingCostRate = .06; //For future implementation of swapping homes throughout life phases

  // Renting Expenses
  monthlyRent = 2000;
  rentGrowthRate = 0.03;

  // Tax deduction constants
  readonly SALT_DEDUCTION_LIMIT = 10000; // $10,000 SALT deduction limit
  readonly STATE_TAX_RATE = 0.05;        // Example state tax rate
  readonly FEDERAL_TAX_RATE = 0.22;      // Example federal marginal tax rate
  readonly STATE_INCOME = 80000;         // Example state taxable income

  // Filing status enum
  filingStatus = {
    SINGLE: 'single',
    MARRIED_JOINT: 'married_joint',
    HEAD_HOUSEHOLD: 'head_household'
  };

  // Tax configuration
  taxConfig = {
    selectedFilingStatus: this.filingStatus.SINGLE,
    taxYear: 2024,
    standardDeductions: {
      2024: {
        [this.filingStatus.SINGLE]: 13850,
        [this.filingStatus.MARRIED_JOINT]: 27700,
        [this.filingStatus.HEAD_HOUSEHOLD]: 20800
      }
    }
  };

//   // Get standard deduction based on filing status and year
//   getStandardDeduction(): number {
//     const yearDeductions = this.taxConfig.standardDeductions[this.taxConfig.taxYear];
//     if (!yearDeductions) {
//       console.warn(`Tax year ${this.taxConfig.taxYear} not found, using 2024 rates`);
//       return this.taxConfig.standardDeductions[2024][this.taxConfig.selectedFilingStatus];
//     }
//     return yearDeductions[this.taxConfig.selectedFilingStatus];
//   }

//   // Updated tax savings calculation with dynamic standard deduction
//   calculateTaxSavings(mortgageInterest: number, propertyTax: number): number {
//     // Calculate state income tax
//     const stateIncomeTax = this.STATE_INCOME * this.STATE_TAX_RATE;
//
//     // Apply SALT limit to combined property tax and state income tax
//     const totalSALT = Math.min(propertyTax + stateIncomeTax, this.SALT_DEDUCTION_LIMIT);
//
//     // Total itemized deductions (SALT-limited property tax + mortgage interest)
//     const itemizedDeductions = totalSALT + mortgageInterest;
//
//     // Get current standard deduction based on filing status and year
//     const standardDeduction = this.getStandardDeduction();
//
//     // Only return tax savings if itemized deductions exceed standard deduction
//     if (itemizedDeductions > standardDeduction) {
//       // Tax savings is the marginal rate times the amount above standard deduction
//       return (itemizedDeductions - standardDeduction) * this.FEDERAL_TAX_RATE;
//     }
//
//     return 0; // No tax savings if standard deduction is better
//   }

  //Generate graph
  housingScenarios = this.calculateHousingScenarios(this.avgRateOfReturn, this.startingBalance, .15);

  calculateMortgagePayment(): number {
    const principal = this.housePrice * (1 - this.downPaymentPercent);
    const monthlyRate = this.mortgageRate / 12;
    const payments = this.mortgageYears * 12;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, payments)) /
           (Math.pow(1 + monthlyRate, payments) - 1);
  }

  calculateHousingScenarios(averageReturn: number, initialInvestment: number, stdDeviation: number): {
    yearRange: number[],
    renting: number[],
    buying: number[]
    }
    {
    const yearRange: number[] = [];
    const rentingWealth: number[] = [];
    const buyingWealth: number[] = [];

    // Initial setup
    const downPayment = this.housePrice * this.downPaymentPercent;
    const monthlyMortgage = this.calculateMortgagePayment();
    const initialRentingBalance = initialInvestment;
    const initialBuyingBalance = initialInvestment - downPayment;

    yearRange.push(this.age);
    rentingWealth.push(initialRentingBalance);
    buyingWealth.push(initialBuyingBalance - initialInvestment*this.closingCostRate);

    let currentHouseValue = this.housePrice;
    let currentRent = this.monthlyRent;
    let remainingMortgage = this.housePrice * (1 - this.downPaymentPercent);
    let maintenanceCost = this.housePrice * this.maintenanceRate;  // Initial maintenance cost

    for (let year = 1; year <= this.mortgageYears; year++) {
      // Update house value
      currentHouseValue *= (Math.round((1 + this.homeAppreciationRate) * 100) / 100);

      // Update maintenance cost with inflation rather than house appreciation
      maintenanceCost *= (1 + this.rateOfInflation);

      // Calculate mortgage components
      const annualMortgage = monthlyMortgage * 12;
      const interestPayment = remainingMortgage * this.mortgageRate;
      const principalPayment = annualMortgage - interestPayment;

      // Calculate annual housing costs
      const propertyTax = currentHouseValue * this.propertyTaxRate;
      const insurance = currentHouseValue * this.insuranceRate;
      const totalHomeownerCosts = annualMortgage + propertyTax + maintenanceCost + insurance + interestPayment;

      // Update rent
      currentRent *= (1 + this.rentGrowthRate);
      const annualRent = currentRent * 12;

      // Calculate wealth for renting scenario
      const rentingSavings = this.expectedInvestmentsThisYear;
      const rentingInvestmentsReturn = rentingWealth[year - 1] * (1 + averageReturn) + rentingSavings;
      rentingWealth.push(rentingInvestmentsReturn);

      // Calculate wealth for buying scenario
      const buyingSavings = this.expectedInvestmentsThisYear - totalHomeownerCosts;

      // Calculate investment returns separately from home equity
      const investmentReturn = buyingWealth[year - 1] * (1 + averageReturn) + buyingSavings;

      // Update remaining mortgage
      remainingMortgage -= principalPayment;

      // Total wealth is investments plus home equity
      const homeEquity = currentHouseValue - remainingMortgage;
      buyingWealth.push(investmentReturn + homeEquity);

      yearRange.push(this.age + year);

      console.log(year)
      console.log("totalHomeownerCosts: " + totalHomeownerCosts);
      console.log("buyingWealth: " + investmentReturn + homeEquity);
      console.log("rentingWeatlh: " + rentingInvestmentsReturn);
    }

    return {
      yearRange,
      renting: rentingWealth,
      buying: buyingWealth
    };
  }

//   roundToHundreths(num: number):{rounded: number}{
//     const rounded = (Math.round(num*100)/100)
//     return rounded;
//   }

  lineChartData: ChartData<'line'> = {
    labels: this.housingScenarios.yearRange,
    datasets: [
      {
        data: this.housingScenarios.renting,
        label: 'Renting + Investing',
        borderColor: 'purple',
        backgroundColor: 'purple',
        pointRadius: 0,
      },
      {
        data: this.housingScenarios.buying,
        label: 'Home Ownership',
        borderColor: 'orange',
        backgroundColor: 'orange',
        pointRadius: 0,
      }
    ]
  };

  lineChartOptions = {
      responsive: true,
      scales: {
        x: {title: {display: true,text: 'Age'}},
        y: {title: {display: false,text: 'Wealth'}}}
  };

  lineChartType: 'line' = 'line';

  updateChart(): void {
    this.housingScenarios = this.calculateHousingScenarios(this.avgRateOfReturn, this.startingBalance, .15);

    this.lineChartData.labels = this.housingScenarios.yearRange;
    this.lineChartData.datasets[0].data = this.housingScenarios.renting;
    this.lineChartData.datasets[1].data = this.housingScenarios.buying;

    this.cdRef.detectChanges();
    if (this.chart?.chart) {
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
