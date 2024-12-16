import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Router } from '@angular/router';
import { Expenses } from 'src/app/model/expenses';
import { MatTable } from '@angular/material/table';
import { Incomes } from 'src/app/model/income';
import { CookieService } from 'ngx-cookie-service';

export interface Categories {
  date: string;
  amount: string;
  description: string;
  category: Category;
}

export interface AmountsInterface {
  totals: string;
  planned: number;
  actual: number;
  diff: number;
}

export interface IncomesInterface {
  totals: string;
  planned: number;
}

enum Category {
  empty = '',
  rent = 'Rent',
  food = 'Food',
  strippers = 'Strippers'
}

const USER_DATA = [
  { "totals": "Savings", "planned": 3600.00 },
  { "totals": "Paycheck", "planned": 1500.00 },
  { "totals": "Bonus", "planned": 200.00 },
  { "totals": "Interest", "planned": 43.65 },
  { "totals": "Other", "planned": 0.00 },
];

const COLUMNS_SCHEMA = [
  {
    key: "totals",
    type: "totals",
    label: "Totals"
  },
  {
    key: "planned",
    type: "planned",
    label: "Planned"
  },
  {
    key: "isEdit",
    type: "isEdit",
    label: ""
  }
]

const EXPENSE_DATA: AmountsInterface[] = []
const INCOME_DATA: IncomesInterface[] = []

@Component({
  selector: 'app-budget-main',
  templateUrl: './budget-main.component.html',
  styleUrls: ['./budget-main.component.scss']
})
export class BudgetMainComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  @ViewChild(MatTable) table1: MatTable<AmountsInterface>;
  @ViewChild(MatTable) table2: MatTable<AmountsInterface>;

  formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  value: number = 0;
  startingBalance = 1000;
  endingBalance = 2000;
  totalSavingsIncrease = 100;
  totalSavedMonth: string = '';
  public currentDate = new Date();
  cookieValue: string;

  expenseDisplayedColumns: string[] = ['totals', 'planned', 'actual', 'diff'];
  expenseDataSource = EXPENSE_DATA;

  incomeDisplayedColumns: string[] = ['totals', 'planned'];
  incomeDataSource = INCOME_DATA;
  editDataSource: any;
  editDisplayedColumns: string[] = COLUMNS_SCHEMA.map((col) => col.key);
  editColumnsSchema: any = COLUMNS_SCHEMA;
  public expenses = new Expenses();
  public incomes = new Incomes();

  pushData() {
    for (let expense of this.expenses.expenses) {
      this.expenseDataSource.push({ totals: expense.value, planned: 10, actual: 20, diff: -10 },);
    }
    for (let income of this.incomes.incomes) {
      this.incomeDataSource.push({ totals: income.value, planned: 10 },);
    }
    this.table1.renderRows();
    this.table2.renderRows();
  }

  setUserData(type: string, value: any) {
    for (let entry of this.editDataSource) {
      if (entry.totals == type) {
        entry.planned = value;
      }
    }
    this.cookieService.set('user_data', JSON.stringify(this.editDataSource));
  }

  readUserData() {
    if(this.cookieService.get('user_data')!= '') {
      console.log(this.cookieService.get('user_data'));
      this.editDataSource = JSON.parse(this.cookieService.get('user_data'));
    }
  }

  public barChartLegend = false;
  public barChartPlugins = [
  ];

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Start Balance: ' + this.formatter.format(this.startingBalance), 'End Balance: ' + this.formatter.format(this.endingBalance)],
    datasets: [
      {
        data: [this.startingBalance, this.endingBalance],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(75, 192, 192, 0.2)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(75, 192, 192)',
        ],
        borderWidth: 1
      },
    ]
  };

  public incomeExpensesBarChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Planned: ' + this.formatter.format(this.startingBalance), 'Actual: ' + this.formatter.format(this.endingBalance)],
    datasets: [
      {
        data: [this.startingBalance, this.endingBalance],
        indexAxis: 'y',
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 99, 132, 0.2)',
        ],
        borderColor: [
          'rgb(75, 192, 192)',
          'rgb(255, 99, 132)',
        ],
        borderWidth: 1
      },
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

  constructor(private router: Router, private cookieService: CookieService) {
    this.editDataSource = USER_DATA;
    this.readUserData();
  }

  ngOnInit(): void {
    let saved = this.endingBalance - this.startingBalance;
    this.totalSavedMonth = this.formatter.format(saved);
    this.pushData();
  }
}
