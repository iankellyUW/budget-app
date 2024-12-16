import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyingVsRentingComponent } from './buying-vs-renting.component';

describe('BuyingVsRentingComponent', () => {
  let component: BuyingVsRentingComponent;
  let fixture: ComponentFixture<BuyingVsRentingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyingVsRentingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyingVsRentingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
