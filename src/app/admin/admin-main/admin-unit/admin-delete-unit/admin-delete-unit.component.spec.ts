import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDeleteUnitComponent } from './admin-delete-unit.component';

describe('AdminDeleteUnitComponent', () => {
  let component: AdminDeleteUnitComponent;
  let fixture: ComponentFixture<AdminDeleteUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDeleteUnitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDeleteUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
