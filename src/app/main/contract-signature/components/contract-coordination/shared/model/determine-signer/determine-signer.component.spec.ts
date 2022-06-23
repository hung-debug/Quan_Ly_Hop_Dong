import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetermineSignerComponent } from './determine-signer.component';

describe('DetermineSignerComponent', () => {
  let component: DetermineSignerComponent;
  let fixture: ComponentFixture<DetermineSignerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetermineSignerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetermineSignerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
