import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInfoUserComponent } from './admin-info-user.component';

describe('AdminInfoUserComponent', () => {
  let component: AdminInfoUserComponent;
  let fixture: ComponentFixture<AdminInfoUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminInfoUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminInfoUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
