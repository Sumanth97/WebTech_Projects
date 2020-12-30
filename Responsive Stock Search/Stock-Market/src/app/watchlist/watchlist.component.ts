import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {DetailsService } from '../details/details.service';
import { Watchlist } from '.././models/watchlist';
import { arrayMax } from 'highcharts';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {

  watchlist_tickers: any[] = [];
  watchlist_names: any[] = []; 
  watchlistData: Watchlist;
  isempty: boolean = false;
  pageLoading: boolean = true;

  constructor(private detailsService: DetailsService, private detectChange: ChangeDetectorRef ) {}

  ngOnInit(): void {
    this.watchlist_tickers = JSON.parse(localStorage.getItem("watchlistItems"))
    if(this.watchlist_tickers === null || this.watchlist_tickers.length == 0){
      this.isempty = true;
      this.pageLoading = false;
    }
    else if(this.watchlist_tickers.length > 0){
      this.isempty = false;
      this.watchlist_tickers = this.watchlist_tickers.sort();
      var data = [];
      this.watchlist_tickers.forEach(function (val){
        data.push(localStorage.getItem(val));
      });
      this.watchlist_names = data;
      this.detailsService.getDataWatchlist(this.watchlist_tickers.join(','))
      .subscribe(response => {
        this.watchlistData = response;
        this.pageLoading = false;
      });
    }
    
  }

  removeFromWatchlist(ticker){
    this.detailsService.delWatchlistItem(ticker);
    this.watchlist_tickers = JSON.parse(localStorage.getItem('watchlistItems'));
    if(this.watchlist_tickers === null || this.watchlist_tickers.length == 0){
      this.isempty = true;
    }
    else if(this.watchlist_tickers.length > 0){
      this.isempty = false;
      this.watchlist_tickers = this.watchlist_tickers.sort();
      var data = [];
      this.watchlist_tickers.forEach(function (val){
        data.push(localStorage.getItem(val));
      });
      this.watchlist_names = data;
      this.detailsService.getDataWatchlist(this.watchlist_tickers.join(','))
      .subscribe(response => {
        this.watchlistData = response;
      });
    }
    this.detectChange.detectChanges();
  }

}
