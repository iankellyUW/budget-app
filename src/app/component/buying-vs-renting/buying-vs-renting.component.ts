import { Component, Output, EventEmitter } from '@angular/core';
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
  @Output() rateChange = new EventEmitter<number>();
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
  avgSalaryGrowth = .05;
  rateOfInflation = .025;

  // Housing variables
  housePrice = 100000;
  downPaymentPercent = 0.20;
  // Growth
  homeAppreciationRate = 0.00;
  // Housing Expenses
  maintenanceRate = 0.01;
  propertyTaxRate = 0.01;
  mortgageRate = 0.065;
    selectedCreditScore: string = '780';
    selectedDownPaymentRange: string = '30';
    rateAdjustment = 0;
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
    // Returned Data
    const yearRange: number[] = [];
    const rentingWealth: number[] = [];
    const buyingWealth: number[] = [];
    //Separately track for buying wealth
    const buyingInvestmentReturns: number[] = [];
    const homeEquityTracker: number[] = [];

    // Initial setup
    const downPayment = this.housePrice * this.downPaymentPercent;
    const monthlyMortgage = this.calculateMortgagePayment();
    const initialRentingBalance = initialInvestment;
    const initialBuyingBalance = initialInvestment - downPayment;
    const initialEquity = downPayment - initialInvestment * this.closingCostRate;

    let currentHouseValue = this.housePrice;
    let currentRent = this.monthlyRent;
    let remainingMortgage = this.roundToHundredths(this.housePrice * (1 - this.downPaymentPercent));
    let maintenanceCost = this.roundToHundredths(this.housePrice * this.maintenanceRate);  // Initial maintenance cost
    let currentYearInvestment = this.expectedInvestmentsThisYear;
    let annualRent = this.monthlyRent * 12;

    yearRange.push(this.age);
    rentingWealth.push(initialRentingBalance);
    buyingInvestmentReturns.push(initialBuyingBalance - initialInvestment * this.closingCostRate);
    homeEquityTracker.push(initialEquity);
    buyingWealth.push(buyingInvestmentReturns[0] + homeEquityTracker[0]);

    for (let year = 1; year <= this.mortgageYears; year++) {
      // Update house value
      currentHouseValue *= this.roundToHundredths(1 + this.homeAppreciationRate);
      // Update maintenance cost with inflation rather than house appreciation
      maintenanceCost *= this.roundToThousandth(1 + this.rateOfInflation);
      // Update investment amount with salary growth
      currentYearInvestment *= (1 + this.avgSalaryGrowth);
      // Update rent
      currentRent *= (1 + this.rentGrowthRate);
      annualRent = this.roundToHundredths(currentRent * 12);

      // Calculate mortgage components
      const annualMortgage = this.roundToHundredths(monthlyMortgage * 12);
      const interestPayment = this.roundToHundredths(remainingMortgage * this.mortgageRate);
      const principalPayment = this.roundToHundredths(annualMortgage - interestPayment);

      // Calculate annual housing costs
      const propertyTax = this.roundToHundredths(currentHouseValue * this.propertyTaxRate);
      const insurance = this.roundToHundredths(currentHouseValue * this.insuranceRate);
      const totalHomeownerCosts = this.roundToHundredths(annualMortgage + propertyTax + maintenanceCost + insurance + interestPayment);

      // Calculate wealth for renting scenario
      const rentingInvestmentsReturn = this.roundToHundredths(rentingWealth[year - 1] * (1 + averageReturn) + currentYearInvestment);
      rentingWealth.push(rentingInvestmentsReturn);

      // Calculate wealth for buying scenario
      const buyingCurrentYearInvestments = this.roundToHundredths(currentYearInvestment - totalHomeownerCosts + annualRent/3);

      // Calculate investment returns separately from home equity
      const buyingInvestmentReturn = this.roundToHundredths(buyingInvestmentReturns[year - 1] * (1 + averageReturn) + buyingCurrentYearInvestments);
      buyingInvestmentReturns.push(buyingInvestmentReturn);

      // Update remaining mortgage
      remainingMortgage -= principalPayment;

      // Calculate home equity
      const homeEquity = this.roundToHundredths(currentHouseValue - remainingMortgage);
      homeEquityTracker.push(homeEquity);

      // Total wealth is investments plus home equity
      buyingWealth.push(buyingInvestmentReturn + homeEquity);

      yearRange.push(this.age + year);

      console.log(year);
      console.log("totalHomeownerCosts: " + totalHomeownerCosts);
      console.log("principalPayments: " + principalPayment)
      console.log("buyingWealth: " + this.roundToHundredths(buyingInvestmentReturn + homeEquity) + " buyingInvestments : " + buyingInvestmentReturn + " homeEquity: " + homeEquity);
      console.log("rentingWeatlh: " + rentingInvestmentsReturn);
    }

    return {
      yearRange,
      renting: rentingWealth,
      buying: buyingWealth
    };
  }

  private readonly rateGrid: { [key: string]: { [key: string]: number } } = {
      '780': { '70': 0.000, '40': 0.000, '30': 0.000, '25': 0.000, '20': 0.375, '15': 0.375, '10': 0.250, '5': 0.250, '0': 0.125 },
      '760': { '70': 0.000, '40': 0.000, '30': 0.000, '25': 0.250, '20': 0.625, '15': 0.625, '10': 0.500, '5': 0.500, '0': 0.250 },
      '740': { '70': 0.000, '40': 0.000, '30': 0.125, '25': 0.375, '20': 0.875, '15': 1.000, '10': 0.750, '5': 0.625, '0': 0.500 },
      '720': { '70': 0.000, '40': 0.000, '30': 0.250, '25': 0.750, '20': 1.250, '15': 1.250, '10': 1.000, '5': 0.875, '0': 0.750 },
      '700': { '70': 0.000, '40': 0.000, '30': 0.375, '25': 0.875, '20': 1.375, '15': 1.500, '10': 1.250, '5': 1.125, '0': 0.875 },
      '680': { '70': 0.000, '40': 0.000, '30': 0.625, '25': 1.125, '20': 1.750, '15': 1.875, '10': 1.500, '5': 1.375, '0': 1.125 },
      '660': { '70': 0.000, '40': 0.000, '30': 0.750, '25': 1.375, '20': 1.875, '15': 2.125, '10': 1.750, '5': 1.625, '0': 1.250 },
      '640': { '70': 0.000, '40': 0.000, '30': 1.125, '25': 1.500, '20': 2.250, '15': 2.500, '10': 2.000, '5': 1.875, '0': 1.500 },
      '620': { '70': 0.000, '40': 0.125, '30': 1.500, '25': 2.125, '80': 2.750, '85': 2.875, '10': 2.625, '5': 2.250, '0': 1.750 }
    };

    updateRate() {
      this.rateAdjustment = this.rateGrid[this.selectedCreditScore][this.selectedDownPaymentRange];
      this.mortgageRate += this.rateAdjustment/100
      this.downPaymentPercent = this.rateGrid[this.selectedCreditScore][this.selectedDownPaymentRange];
      this.rateChange.emit(this.rateAdjustment);

  }

  roundToHundredths(num: number): number{
    return (Math.round(num*100)/100);
  }

  roundToThousandth(num: number): number{
      return (Math.round(num*1000)/1000);
  }

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
