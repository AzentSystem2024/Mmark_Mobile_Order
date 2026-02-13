import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferOutComponent } from './transfer-out.component';

describe('TransferOutComponent', () => {
  let component: TransferOutComponent;
  let fixture: ComponentFixture<TransferOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferOutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
