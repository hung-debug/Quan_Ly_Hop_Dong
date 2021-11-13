import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinatesContractComponent } from './coordinates-contract.component';

describe('CoordinatesContractComponent', () => {
  let component: CoordinatesContractComponent;
  let fixture: ComponentFixture<CoordinatesContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoordinatesContractComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoordinatesContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
