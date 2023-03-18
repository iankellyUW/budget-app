import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Expenses } from 'src/app/model/expenses';

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

export class TransactionsMainComponent implements OnInit {
  @ViewChild(MatTable) table!: MatTable<Category>;

  constructor(private router: Router, public dialog: MatDialog) { }

  formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  ngOnInit(): void {
    this.pushData();
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
  categoryData: Categories = {date: '', amount: '$0.00', description: '',category: Category.empty };

  addData() {
    this.pushData();
    this.table.renderRows();
  }

  removeData() {
    this.dataSource.pop();
    this.table.renderRows();
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
      default: {
        break;
      }
    }
  }

  pushData(): void {
    this.dataSource.push({ date: this.currentDate.toLocaleTimeString(), amount: this.formatter.format(100), description: 'I ordered food', category: Category.food },)
  }

  pushNewExpense(category: Categories) {
    this.dataSource.push({date: this.currentDate.toLocaleTimeString(), amount: category.amount, description: category.description, category: category.category});
    this.table.renderRows();
  }
}

@Component({
  selector: 'transactions-main-dialog',
  templateUrl: 'transactions-main-dialog.html',
})
export class TransactionMainDialog {
  constructor(
    public dialogRef: MatDialogRef<TransactionMainDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Categories,
  ) {}

  formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  //selected value for expense dialogue
  selectedValue: string = '';

  categoryData: Categories = {date: '', amount: '$0.00', description: '',category: Category.empty };

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

