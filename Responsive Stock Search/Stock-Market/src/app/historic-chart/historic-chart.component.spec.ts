import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricChartComponent } from './historic-chart.component';

describe('HistoricChartComponent', () => {
  let component: HistoricChartComponent;
  let fixture: ComponentFixture<HistoricChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
