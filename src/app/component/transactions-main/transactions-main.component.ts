import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


export interface Categories {
  date: string;
  amount: number;
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
  categoryData: Categories | undefined;

  addData() {
    this.pushData();
    this.table.renderRows();
  }

  removeData() {
    this.dataSource.pop();
    this.table.renderRows();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: { date: this.pDate, amount: this.pAmount, description: this.pDescription, category: this.pCategory },
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.categoryData = result;
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
    this.dataSource.push({ date: this.currentDate.toLocaleTimeString(), amount: 100, description: 'I ordered food', category: Category.food },)
  }
}

