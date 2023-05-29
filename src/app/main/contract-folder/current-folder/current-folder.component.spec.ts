import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentFolderComponent } from './current-folder.component';

describe('CurrentFolderComponent', () => {
  let component: CurrentFolderComponent;
  let fixture: ComponentFixture<CurrentFolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentFolderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
