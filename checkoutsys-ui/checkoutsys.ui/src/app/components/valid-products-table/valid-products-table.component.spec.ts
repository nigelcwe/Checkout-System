import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidProductsTableComponent } from './valid-products-table.component';

describe('ValidProductsTableComponent', () => {
  let component: ValidProductsTableComponent;
  let fixture: ComponentFixture<ValidProductsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidProductsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidProductsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
