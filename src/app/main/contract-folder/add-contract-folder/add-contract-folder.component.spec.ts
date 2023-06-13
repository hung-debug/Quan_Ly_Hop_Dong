import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContractFolderComponent } from './add-contract-folder.component';

describe('AddContractFolderComponent', () => {
  let component: AddContractFolderComponent;
  let fixture: ComponentFixture<AddContractFolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddContractFolderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddContractFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
