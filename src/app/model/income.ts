export interface Income {
    value: string;
    viewValue: string;
  }

export class Incomes {
    public incomes: Income[] = [
        {value: 'Savings', viewValue: 'Savings'},
        {value: 'Paycheck', viewValue: 'Paycheck'},
        {value: 'Bonus', viewValue: 'Bonus'},
        {value: 'Interest', viewValue: 'Interest'},
        {value: 'Other', viewValue: 'Other'},
      ];
}