import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditArticleInventoryComponent } from './edit-article-inventory.component';

describe('EditArticleInventoryComponent', () => {
  let component: EditArticleInventoryComponent;
  let fixture: ComponentFixture<EditArticleInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditArticleInventoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditArticleInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
