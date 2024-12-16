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

  // Savings variables
  age = 24;
  startingBalance = 40000;
  expectedInvestmentsThisYear = 20000;
  avgRateOfReturn = .07;
  annualIncome = 100000;
  avgSalaryGrowth = .05;
  annualExpenses = 45000;
  rateOfInflation = .025;
  taxRate = .25; //Marginal tax rate for deductions


  // Housing variables
  housePrice = 500000;
  downPaymentPercent = 0.20;
  mortgageYears = 30;

  // Growth
  homeAppreciationRate = 0.05;
  housingAppreciationStdDev = .03;

  // Housing Expenses
  maintenanceRate = 0.01;
  propertyTaxRate = 0.01;
  mortgageRate = 0.065;
    //Tax stuff
    selectedCreditScore: string = '780';
    selectedDownPaymentRange: string = '30';
    rateAdjustment = 0;
  insuranceRate = 0.005;

  // One time costs
  closingCostRate = .03;
  sellingCostRate = .06; //For future implementation of swapping homes throughout life phases

  // Renting Expenses
  monthlyRent = 2000;
  rentGrowthRate = 0.03;
  rentingStdDev = .15;

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
      rentingUpperBound: number[],
      rentingLowerBound: number[],
      buying: number[],
      buyingUpperBound: number[],
      buyingLowerBound: number[],
      homeEquity: number[],
      homePrice: number[]
    }
    {
      const yearRange: number[] = [];
      const rentingWealth: number[] = [];
      const rentingUpperBound: number[] = [];
      const rentingLowerBound: number[] = [];
      const buyingWealth: number[] = [];
      const buyingUpperBound: number[] = [];
      const buyingLowerBound: number[] = [];
      const buyingInvestmentReturns: number[] = [];
      const homeEquityTracker: number[] = [];
      const homePriceTracker: number[] = [];


      const downPayment = this.housePrice * this.downPaymentPercent;
      const monthlyMortgage = this.calculateMortgagePayment();
      const initialRentingBalance = initialInvestment;
      const initialBuyingBalance = initialInvestment - downPayment;
      const initialEquity = downPayment - initialInvestment * this.closingCostRate;


      let currentIncome = this.annualIncome;
      let afterTaxIncome = currentIncome * (1 - this.taxRate);
      let annualMortgage = this.roundToHundredths(monthlyMortgage * 12);
      let currentHouseValue = this.housePrice;
      let remainingMortgage = this.roundToHundredths(this.housePrice * (1 - this.downPaymentPercent));
      let maintenanceCost = this.roundToHundredths(this.housePrice * this.maintenanceRate);
      let currentRent = this.monthlyRent;
      let currentYearInvestment = this.expectedInvestmentsThisYear;
      let annualRent = this.monthlyRent * 12;
      let annualExpenses = this.annualExpenses;

      yearRange.push(this.age);
      rentingWealth.push(initialRentingBalance);
      rentingUpperBound.push(initialRentingBalance);
      rentingLowerBound.push(initialRentingBalance);

      homePriceTracker.push(this.housePrice);
      homeEquityTracker.push(initialEquity);
      buyingInvestmentReturns.push(initialBuyingBalance - initialInvestment * this.closingCostRate);
      buyingWealth.push(buyingInvestmentReturns[0] + homeEquityTracker[0]);
      buyingUpperBound.push(buyingWealth[0]);
      buyingLowerBound.push(buyingWealth[0]);

      for (let year = 1; year <= 45; year++) {
        // Update income and expenses with growth rates
        currentIncome *= (1 + this.avgSalaryGrowth);
        afterTaxIncome = currentIncome * (1 - this.taxRate);
        annualExpenses *= (annualExpenses * this.rateOfInflation);

        // Update housing-related variables
        currentHouseValue *= this.roundToHundredths(1 + this.homeAppreciationRate);
        maintenanceCost *= this.roundToThousandth(1 + this.rateOfInflation);
        currentYearInvestment *= (1 + this.avgSalaryGrowth);
        currentRent *= (1 + this.rentGrowthRate);
        annualRent = this.roundToHundredths(currentRent * 12);

        //Seperate annual mortgage into interest and principalPayment
        if (remainingMortgage < 0) {
            annualMortgage = 0;
        }
        const interestPayment = this.roundToHundredths(remainingMortgage * this.mortgageRate);
        const principalPayment = this.roundToHundredths(annualMortgage - interestPayment);
        const propertyTax = this.roundToHundredths(currentHouseValue * this.propertyTaxRate);
        const insurance = this.roundToHundredths(currentHouseValue * this.insuranceRate);
        const totalHomeownerCosts = this.roundToHundredths(annualMortgage + propertyTax + maintenanceCost + insurance);

        // Calculate available money for investments
        const rentingAvailableForInvestment = this.roundToHundredths(afterTaxIncome - (annualExpenses + annualRent));
        const buyingAvailableForInvestment = this.roundToHundredths(afterTaxIncome - (annualExpenses + totalHomeownerCosts));

        // Calculate investment returns with available money
        const rentingInvestmentsReturn = this.roundToHundredths(rentingWealth[year - 1] * (1 + averageReturn) + rentingAvailableForInvestment);
        const buyingInvestmentReturn = this.roundToHundredths(buyingInvestmentReturns[year - 1] * (1 + averageReturn) + buyingAvailableForInvestment);

        // Using square root of time to reflect decreasing volatility over time
        const investmentReturnTimeAdjustedStdDev = stdDeviation / Math.sqrt(year);
        const buyingTimeAdjustedStdDev = this.housingAppreciationStdDev / Math.sqrt(year);

        // Calculate renting bounds with time-adjusted standard deviation
        const rentingStdDev = Math.abs(rentingInvestmentsReturn * investmentReturnTimeAdjustedStdDev);
        const rentingUpper = rentingInvestmentsReturn + rentingStdDev;
        const rentingLower = rentingInvestmentsReturn - rentingStdDev;

        // Update remaining mortgage and home equity
        remainingMortgage -= principalPayment;
        const homeEquity = this.roundToThousandth(currentHouseValue - remainingMortgage);
        const buyingTotalWealth = buyingInvestmentReturn + homeEquity;

        // Calculate buying bounds with time-adjusted standard deviation
        const buyingStdDev = Math.abs(buyingTotalWealth * buyingTimeAdjustedStdDev);
        const buyingUpper = buyingTotalWealth + buyingStdDev;
        const buyingLower = buyingTotalWealth - buyingStdDev;

        // Store values
          yearRange.push(this.age + year);
          rentingWealth.push(this.roundToHundredths(rentingInvestmentsReturn));
          rentingUpperBound.push(this.roundToHundredths(rentingUpper));
          rentingLowerBound.push(this.roundToHundredths(rentingLower));
          buyingInvestmentReturns.push(this.roundToHundredths(buyingInvestmentReturn));
          homeEquityTracker.push(this.roundToHundredths(homeEquity));
          homePriceTracker.push(this.roundToHundredths(currentHouseValue));
          buyingWealth.push(this.roundToHundredths(buyingTotalWealth));
          buyingUpperBound.push(this.roundToHundredths(buyingUpper));
          buyingLowerBound.push(this.roundToHundredths(buyingLower));
        }

        return {
          yearRange,
          renting: rentingWealth,
          rentingUpperBound,
          rentingLowerBound,
          buying: buyingWealth,
          buyingUpperBound,
          buyingLowerBound,
          homeEquity: homeEquityTracker,
          homePrice: homePriceTracker
      };
    }

  // Exhibit 19 buying grid
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
          data: this.housingScenarios.rentingUpperBound,
          label: '',
          borderColor: 'rgba(128, 0, 128, 0.3)',
          backgroundColor: 'rgba(128, 0, 128, 0.1)',
          pointRadius: 0,
          borderDash: [5, 5],
          fill: false
        },
        {
          data: this.housingScenarios.rentingLowerBound,
          label: '',
          borderColor: 'rgba(128, 0, 128, 0.3)',
          backgroundColor: 'rgba(128, 0, 128, 0.1)',
          pointRadius: 0,
          borderDash: [5, 5],
          fill: false
        },
        {
          data: this.housingScenarios.buying,
          label: 'Home Ownership',
          borderColor: 'orange',
          backgroundColor: 'orange',
          pointRadius: 0,
        },
        {
          data: this.housingScenarios.buyingUpperBound,
          label: undefined,
          borderColor: 'rgba(255, 165, 0, 0.3)',
          backgroundColor: 'rgba(255, 165, 0, 0.1)',
          pointRadius: 0,
          borderDash: [5, 5],
          fill: false,
          showLine: true,
//           display: false
        },
        {
          data: this.housingScenarios.buyingLowerBound,
          label: undefined,
          borderColor: 'rgba(255, 165, 0, 0.3)',
          backgroundColor: 'rgba(255, 165, 0, 0.1)',
          pointRadius: 0,
          borderDash: [5, 5],
          fill: false,
          showLine: true,
//           display: false
        },
        {
          data: this.housingScenarios.homeEquity,
          label: 'Home Equity',
          borderColor: 'green',
          backgroundColor: 'green',
          pointRadius: 0,
          borderDash: [7, 7],
          fill: false,
          showLine: true,
//           display: false
        },
        {
          data: this.housingScenarios.homePrice,
          label: 'Home Appreciation',
          borderColor: 'blue',
          backgroundColor: 'blue',
          borderDash: [7, 7],
          pointRadius: 0,
        }
      ]
  };

  lineChartOptions = {
    responsive: true,
    scales: {
      x: {title: {display: true, text: 'Age'}},
      y: {title: {display: false, text: 'Wealth'}}
    },
    plugins: {
      legend: {
        labels: {
          filter: (legendItem: { text: string }): boolean => {
            const visibleLabels = ['Renting + Investing', 'Home Ownership', 'Home Equity', 'Home Appreciation'];
            return visibleLabels.indexOf(legendItem.text) !== -1;
          }
        }
      }
    }
  };

  updateChart(): void {
      this.housingScenarios = this.calculateHousingScenarios(this.avgRateOfReturn, this.startingBalance, .15);

      this.lineChartData.labels = this.housingScenarios.yearRange;
      this.lineChartData.datasets[0].data = this.housingScenarios.renting;
      this.lineChartData.datasets[1].data = this.housingScenarios.rentingUpperBound;
      this.lineChartData.datasets[2].data = this.housingScenarios.rentingLowerBound;
      this.lineChartData.datasets[3].data = this.housingScenarios.buying;
      this.lineChartData.datasets[4].data = this.housingScenarios.buyingUpperBound;
      this.lineChartData.datasets[5].data = this.housingScenarios.buyingLowerBound;
      this.lineChartData.datasets[6].data = this.housingScenarios.homeEquity;
      this.lineChartData.datasets[7].data = this.housingScenarios.homePrice;
      this.cdRef.detectChanges();
      if (this.chart?.chart) {
        this.chart.chart.update();
      }
  }

  constructor(private router: Router, private cdRef: ChangeDetectorRef) {}

  //URL Navigator
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

  //Utilities
  roundToHundredths(num: number): number{
      return (Math.round(num*100)/100);
  }

  roundToThousandth(num: number): number{
      return (Math.round(num*1000)/1000);
  }

}
