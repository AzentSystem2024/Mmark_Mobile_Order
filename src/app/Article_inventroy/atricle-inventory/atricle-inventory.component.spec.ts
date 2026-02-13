import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtricleInventoryComponent } from './atricle-inventory.component';

describe('AtricleInventoryComponent', () => {
  let component: AtricleInventoryComponent;
  let fixture: ComponentFixture<AtricleInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtricleInventoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtricleInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
