import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOrderListComponent } from './view-order-list.component';

describe('ViewOrderListComponent', () => {
  let component: ViewOrderListComponent;
  let fixture: ComponentFixture<ViewOrderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewOrderListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
