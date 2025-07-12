import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopFrequentCustomersReportComponent } from './top-frequent-customers-report.component';

describe('TopFrequentCustomersReportComponent', () => {
  let component: TopFrequentCustomersReportComponent;
  let fixture: ComponentFixture<TopFrequentCustomersReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopFrequentCustomersReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TopFrequentCustomersReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
