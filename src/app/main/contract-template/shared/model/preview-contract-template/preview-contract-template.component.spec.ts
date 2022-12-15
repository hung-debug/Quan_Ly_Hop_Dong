import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewContractTemplateComponent } from './preview-contract-template.component';

describe('PreviewContractTemplateComponent', () => {
  let component: PreviewContractTemplateComponent;
  let fixture: ComponentFixture<PreviewContractTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewContractTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewContractTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
