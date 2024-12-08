import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateOfReturnsComponent } from './rate-of-returns.component';

describe('RateOfReturnsComponent', () => {
  let component: RateOfReturnsComponent;
  let fixture: ComponentFixture<RateOfReturnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RateOfReturnsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RateOfReturnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
