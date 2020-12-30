import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Details } from '.././models/details';
import { StockPrice } from '.././models/stock-price';
import { ChartData } from '.././models/chart-data';
import { Watchlist } from '.././models/watchlist';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map, flatMap } from 'rxjs/operators';
import { tick } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
export class DetailsService {

  tickerList: any[] = [];
  stockList: any[] = [];

  constructor(private http: HttpClient) { }
//http://localhost:3000
  getStockDetails(ticker: string): Observable<Details[]> {
    if (ticker !== '') {
      return this.http.get<Details[]>('/details/' + ticker);
    }
  }

  getStockPrice(ticker: string): Observable<StockPrice[]> {
    if (ticker !== '') {
      return this.http.get<StockPrice[]>('/details/price/' + ticker);
    }
  }

  getDailyCharts(ticker: string, date: string): Observable<ChartData[]> {
    if (ticker !== '') {
      return this.http.get<ChartData[]>('/details/chart/' + ticker + '/'+ date);
    }
  }

  isStarred(ticker) {
    if (localStorage.getItem("watchlistItems")) {
      this.tickerList = JSON.parse(localStorage.getItem("watchlistItems"));
    }
    var tickerIndex = this.tickerList.indexOf(ticker);
    return (tickerIndex > -1);

  }
  tickerinWatchlist(ticker, name) {
    this.tickerList.push(ticker);
    localStorage.setItem('watchlistItems', JSON.stringify(this.tickerList));
    localStorage.setItem(ticker, name);
  }

  delWatchlistItem(ticker) {
    if (localStorage.getItem("watchlistItems")) {
      this.tickerList = JSON.parse(localStorage.getItem("watchlistItems"));
    }
    var tickerIndex = this.tickerList.indexOf(ticker);
    if (tickerIndex > -1) {
      this.tickerList.splice(tickerIndex, 1);
      localStorage.setItem('watchlistItems', JSON.stringify(this.tickerList));
      localStorage.removeItem(ticker);
    }

  }
  getDataWatchlist(tickers: string): Observable<Watchlist> {
    return this.http.get<Watchlist>('/watchlist/' + tickers).pipe(
      map(response => new Watchlist().deserialize(response)),
      catchError(this.handleError<Watchlist>('getDataWatchlist'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    }
  }


  addPortfolioToStorage(ticker: string, name: string, stockqty: number, cost: number) {
    //console.log(ticker, name, stockqty, cost)
    if (localStorage.getItem('stockList')) {
      this.stockList = JSON.parse(localStorage.getItem('stockList'));
    }
    var stockidx = this.stockList.indexOf(ticker);
    if (stockidx < 0) {
      //console.log(stockidx )
      this.stockList.push(ticker);
      localStorage.setItem('stockList', JSON.stringify(this.stockList));
      var stk = {};
      stk['name'] = name;
      stk['stockqty'] = stockqty;
      stk['totalCost'] =  cost
      stk['totalCost'] = Number(Math.round((stk['totalCost'] + Number.EPSILON) * 100) / 100);
      stk['meanCost'] = stk['totalCost'] / stk['stockqty'];
      stk['meanCost'] = Number(Math.round((stk['meanCost'] + Number.EPSILON) * 100) / 100);
      localStorage.setItem(ticker + "_p", JSON.stringify(stk));
    }
    else {
      var stkData = JSON.parse(localStorage.getItem(ticker + "_p"));
      stkData['stockqty'] += stockqty;
      stkData['totalCost'] = stkData['totalCost'] + cost
      stkData['totalCost'] = Number(Math.round((stkData['totalCost'] + Number.EPSILON) * 100) / 100);
      stkData['meanCost'] = stkData['totalCost'] / stkData['stockqty'];
      stkData['meanCost'] = Number(Math.round((stkData['meanCost'] + Number.EPSILON) * 100) / 100);
      localStorage.setItem(ticker + "_p", JSON.stringify(stkData));
    }
  }

  getDataPortfolio(tickers: string): Observable<Watchlist> {
    return this.http.get<Watchlist>('/portfolio/' + tickers).pipe(
      map(response => new Watchlist().deserialize(response)),
      catchError(this.handleError<Watchlist>('getDataPortfolio'))
    );
  }

  getLatestPortfolioData(tickers: string[]) {
    var portfolioData = {};
    var latest_last = {};
    return this.getDataPortfolio(tickers.join(','))
      .pipe(
        map((values) => {
          latest_last = values;
          tickers.forEach(function (each) {
            var val = each + "_p";
            portfolioData[each] = JSON.parse(localStorage.getItem(val))
            var last = latest_last[each];
            var change = (portfolioData[each].meanCost - last).toFixed(2);
            var marketValue = portfolioData[each].stockqty * last;

            portfolioData[each]['last'] = last;
            portfolioData[each]['change'] = change;
            portfolioData[each]['marketVal'] = marketValue;
            if (Number(change) > 0) {
              portfolioData[each]['changeColor'] = "#2a7f00";
            }
            else if (Number(change) < 0) {
              portfolioData[each]['changeColor'] = "#f31100";
            }

          })

          return portfolioData;

        }
        )
      );
  }

  popStock(ticker, qty) {
    if (localStorage.getItem('stockList')) {
      this.stockList = JSON.parse(localStorage.getItem('stockList'));
    }
    var stk_idx = this.stockList.indexOf(ticker);
    if (stk_idx > -1) {
      var stkData = JSON.parse(localStorage.getItem(ticker + '_p'))
      var currentQty = stkData['stockqty']
      currentQty -= qty;
      if (currentQty == 0) {
        this.stockList.splice(stk_idx, 1);
        localStorage.setItem('stockList', JSON.stringify(this.stockList));
        localStorage.removeItem(ticker + '_p');
      }
      else {
        stkData['stockqty'] = currentQty;
        var meanCost = stkData['meanCost']
        var totalCost = stkData['totalCost'] - (qty * meanCost);
        totalCost = Number(Math.round((totalCost + Number.EPSILON) * 100) / 100);
        stkData['totalCost'] = totalCost
        localStorage.setItem(ticker + '_p', JSON.stringify(stkData));
      }
    }
  }

}
