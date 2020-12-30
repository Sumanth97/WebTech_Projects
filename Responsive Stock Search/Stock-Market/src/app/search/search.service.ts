import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Stocks } from '.././models/Stocks'
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(private http: HttpClient) {}

  getAllSuggestions(ticker:string): Observable<Stocks[]> {
    if(ticker !== ''){
      return this.http.get<Stocks[]>('/search/' + ticker);
    }
    //+ catchError(()=> throwError('Data Not Found')));
  }
}
