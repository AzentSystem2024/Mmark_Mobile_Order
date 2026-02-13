import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartonEditComponent } from './carton-edit.component';

describe('CartonEditComponent', () => {
  let component: CartonEditComponent;
  let fixture: ComponentFixture<CartonEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartonEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartonEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
