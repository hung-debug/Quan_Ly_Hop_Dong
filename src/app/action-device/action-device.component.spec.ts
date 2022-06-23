import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionDeviceComponent } from './action-device.component';

describe('ActionDeviceComponent', () => {
  let component: ActionDeviceComponent;
  let fixture: ComponentFixture<ActionDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionDeviceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
