import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopSoldProductsComponent } from './top-sold-products.component';

describe('TopSoldProductsComponent', () => {
  let component: TopSoldProductsComponent;
  let fixture: ComponentFixture<TopSoldProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopSoldProductsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TopSoldProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
