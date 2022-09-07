import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EkycDialogSignComponent } from './ekyc-dialog-sign.component';

describe('EkycDialogSignComponent', () => {
  let component: EkycDialogSignComponent;
  let fixture: ComponentFixture<EkycDialogSignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EkycDialogSignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EkycDialogSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
