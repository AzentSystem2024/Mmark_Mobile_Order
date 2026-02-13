import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailerFormComponent } from './retailer-form.component';

describe('RetailerFormComponent', () => {
  let component: RetailerFormComponent;
  let fixture: ComponentFixture<RetailerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RetailerFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetailerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
