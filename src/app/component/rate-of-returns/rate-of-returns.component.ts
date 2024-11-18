import { Component } from '@angular/core';

@Component({
  selector: 'app-rate-of-returns',
  templateUrl: './rate-of-returns.component.html',
  styleUrls: ['./rate-of-returns.component.scss']
})
export class RateOfReturnsComponent {
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
}
