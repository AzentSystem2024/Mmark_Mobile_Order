import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartonInventoryComponent } from './carton-inventory.component';

describe('CartonInventoryComponent', () => {
  let component: CartonInventoryComponent;
  let fixture: ComponentFixture<CartonInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartonInventoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartonInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
