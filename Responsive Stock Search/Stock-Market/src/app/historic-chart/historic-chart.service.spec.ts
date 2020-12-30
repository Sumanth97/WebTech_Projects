import { TestBed } from '@angular/core/testing';

import { HistoricChartService } from './historic-chart.service';

describe('HistoricChartService', () => {
  let service: HistoricChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoricChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
