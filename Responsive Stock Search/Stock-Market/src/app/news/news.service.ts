import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {NewsData} from '../models/news-data';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private http: HttpClient) { }

  getNewsData(ticker:string): Observable<NewsData[]>{
    if(ticker !== ''){
      return this.http.get<NewsData[]>('/details/news/' + ticker);
  }
  }
}
