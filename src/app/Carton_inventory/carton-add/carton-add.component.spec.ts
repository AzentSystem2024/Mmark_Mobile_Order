import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartonAddComponent } from './carton-add.component';

describe('CartonAddComponent', () => {
  let component: CartonAddComponent;
  let fixture: ComponentFixture<CartonAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartonAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartonAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
