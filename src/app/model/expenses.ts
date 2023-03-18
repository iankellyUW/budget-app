export interface Expense {
    value: string;
    viewValue: string;
  }

export class Expenses {
    public expenses: Expense[] = [
        {value: 'Rent', viewValue: 'Rent'},
        {value: 'Food', viewValue: 'Food'},
        {value: 'Gifts', viewValue: 'Gifts'},
        {value: 'Health/Medical', viewValue: 'Health/Medical'},
        {value: 'Home', viewValue: 'Home'},
        {value: 'Transportation', viewValue: 'Transportation'},
        {value: 'Personal', viewValue: 'Personal'},
        {value: 'Pets', viewValue: 'Pets'},
        {value: 'Utilities', viewValue: 'Utilities'},
        {value: 'Travel', viewValue: 'Travel'},
        {value: 'Debt', viewValue: 'Debt'},
        {value: 'GoingOut', viewValue: 'Going Out'},
        {value: 'Strippers', viewValue: 'Strippers'},
      ];
}