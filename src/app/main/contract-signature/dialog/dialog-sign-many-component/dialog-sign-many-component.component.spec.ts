import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSignManyComponentComponent } from './dialog-sign-many-component.component';

describe('DialogSignManyComponentComponent', () => {
  let component: DialogSignManyComponentComponent;
  let fixture: ComponentFixture<DialogSignManyComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogSignManyComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSignManyComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
