import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Expenses } from 'src/app/model/expenses';
import { CookieService } from 'ngx-cookie-service';

export interface DialogData {
  animal: string;
  name: string;
}

export interface Categories {
  date: string;
  amount: string;
  description: string;
  category: Category;
}

enum Category {
  empty = '',
  rent = 'Rent',
  food = 'Food',
  strippers = 'Strippers'
}

const CATEGORY_DATA: Categories[] = []

@Component({
  selector: 'app-transactions-main',
  templateUrl: './transactions-main.component.html',
  styleUrls: ['./transactions-main.component.scss']
})

export class TransactionsMainComponent implements OnInit, AfterViewInit {
  @ViewChild(MatTable) table!: MatTable<Category>;

  constructor(private router: Router, public dialog: MatDialog, private cookieService: CookieService,) {
  }

  formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  ngOnInit(): void {
    //this.pushData();
  }
  ngAfterViewInit(): void {
    this.readDataFromCookies();
  }
  //Default Values
  public currentDate = new Date();

  //Table Setup
  displayedColumns: string[] = ['date', 'amount', 'description', 'category'];
  dataSource = [...CATEGORY_DATA];

  //data for the pop-up dialogue
  pDate: string = '';
  pAmount: number = 0;
  pDescription: string = '';
  pCategory: Category = Category.empty;



  //category data object
  categoryData: Categories = { date: '', amount: '$0.00', description: '', category: Category.empty };


  removeData() {
    this.dataSource.pop();
    this.table.renderRows();
  }

  setUserData() {
    this.cookieService.set('user_transactions_data', JSON.stringify(this.dataSource));
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(TransactionMainDialog, {
      data: { amount: this.pAmount, description: this.pDescription, category: this.pCategory },
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed, result: ' + result);
      this.categoryData = result;
      console.log(this.categoryData);
      this.pushNewExpense(this.categoryData);
      this.setUserData();
    });
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

  // pushData(): void {
  //   this.dataSource.push({ date: (this.currentDate.getMonth() + 1).toString() + '/' + this.currentDate.getDate().toString(), amount: this.formatter.format(100), description: 'I ordered food', category: Category.food },);
  // }

  readDataFromCookies() {
    if (this.cookieService.get('user_transactions_data') != '') {
      let items = JSON.parse(this.cookieService.get('user_transactions_data')) as Categories[];
      console.log(items);
      for(let item of items) {
        this.pushNewExpense(item);
      }
    }
  }

  pushNewExpense(category: Categories) {
    this.dataSource.push({ date: (this.currentDate.getMonth() + 1).toString() + '/' + this.currentDate.getDate().toString(), amount: category.amount, description: category.description, category: category.category });
    this.table.renderRows();
  }
}

@Component({
  selector: 'transactions-main-dialog',
  templateUrl: 'transactions-main-dialog.html',
})
export class TransactionMainDialog {
  constructor(
    private cookieService: CookieService,
    public dialogRef: MatDialogRef<TransactionMainDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Categories,
  ) { }

  formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  //selected value for expense dialogue
  selectedValue: string = '';

  categoryData: Categories = { date: '', amount: '$0.00', description: '', category: Category.empty };

  public expenses = new Expenses();

  onNoClick(): void {
    this.dialogRef.close();
  }



  confirmSelection(): void {
    this.categoryData.amount = this.formatter.format(Number(this.data.amount));
    this.categoryData.description = this.data.description;
    this.categoryData.category = this.selectedValue as Category;
    this.dialogRef.close(this.categoryData);
  }
}

