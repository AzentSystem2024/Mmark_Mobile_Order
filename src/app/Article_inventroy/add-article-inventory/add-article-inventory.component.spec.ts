import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddArticleInventoryComponent } from './add-article-inventory.component';

describe('AddArticleInventoryComponent', () => {
  let component: AddArticleInventoryComponent;
  let fixture: ComponentFixture<AddArticleInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddArticleInventoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddArticleInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
