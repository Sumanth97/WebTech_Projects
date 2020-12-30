import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http';
import { HistoricData } from '.././models/historic-data';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HistoricChartService {

  constructor(private http: HttpClient) { }

  getHistoricCharts(ticker:string): Observable<HistoricData[]>{
    if(ticker !== ''){
      return this.http.get<HistoricData[]>('/details/data/' + ticker);
  }
  }
}
