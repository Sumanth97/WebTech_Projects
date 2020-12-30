import { Component, OnInit } from '@angular/core';
import {DetailsService } from './details.service';
import { Details } from '.././models/details';
import {Subscription,Observable, timer} from 'rxjs';
import {map, flatMap, switchMap} from 'rxjs/operators';
import { StockPrice } from '.././models/stock-price';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  details: Details[];
  prices: StockPrice[];
  marketStatus: boolean;
  midVal: boolean = true;
  ticker: string;
  isFavorite: boolean;
  starred: boolean;
  unstarred: boolean;
  globalLast:number;
  stockqty: number;
  buyStock:boolean;
  changeStatus: boolean;
  invalidTicker: boolean; 
  subscription: Subscription;
  interval: any;
  pageLoading:boolean =true;

  constructor(private detailsService: DetailsService,private route: ActivatedRoute, private router:Router, private modalService: NgbModal) { 
  }

  ngOnInit(): void {
    this.ticker = this.route.snapshot.paramMap.get('ticker');
    this.detailsService.getStockDetails(this.ticker)
    .subscribe(response => {
      if(response.hasOwnProperty('detail')){
        this.invalidTicker = true;
      }
      else{
        this.invalidTicker = false;
        this.details = response;
      }
      this.pageLoading = false;
    });
  
    this.detailsService.getStockPrice(this.ticker)
    .subscribe(response => {
      this.prices = response;
      this.prices['change'] = (this.prices['last'] - this.prices['prevClose']).toFixed(2);
      this.prices['changePercent'] = ((this.prices['change']/this.prices['prevClose'])*100).toFixed(2);
      if(this.prices['change'] >= 0){
        this.prices['color'] = 'green';
        this.changeStatus = true;
      }
      else if(this.prices['change'] < 0){
        this.prices['color'] = 'red';
        this.changeStatus = false;
      }
      // else{
      //   this.prices['color'] = 'black';
      // }
      this.prices['currentTimestamp'] = new Date();//.toISOString();
      if( ((this.prices['currentTimestamp'] - this.prices['timestamp'])/1000 < 60) && (this.prices['askPrice'] !== null && this.prices['bidSize'] !== null 
      && this.prices['bidPrize'] !== null && this.prices['askSize'] !== null)){
        this.marketStatus = true;
      }
      else{
        this.marketStatus = false;
      }
      if(this.prices['mid'] == null){
        this.midVal = false;
      }
    });  
    if(this.marketStatus == true){
      this.interval = setInterval(() => {
        this.priceSubscribe();
        
      },15000);
    }
    else{
      this.interval = setInterval(() => {
        this.prices['currentTimestamp'] = new Date();
        
      },15000);
    }
   
    this.isFavorite = this.detailsService.isStarred(this.ticker);
    
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
    
      if (this.interval) {
        clearInterval(this.interval);
      }
   
}

priceSubscribe(){
  return this.detailsService.getStockPrice(this.ticker)
  .subscribe(response => {
    this.prices = response;
    this.prices['change'] = (this.prices['last'] - this.prices['prevClose']).toFixed(2);
    this.prices['changePercent'] = ((this.prices['change']/this.prices['prevClose'])*100).toFixed(2);
    if(this.prices['change'] >= 0){
      this.prices['color'] = 'green';
      this.changeStatus = true;
    }
    else if(this.prices['change'] < 0){
      this.prices['color'] = 'red';
      this.changeStatus = false;
    }
    // else{
    //   this.prices['color'] = 'black';
    // }
    this.prices['currentTimestamp'] = new Date();//.toISOString();
    if(this.prices['askPrice'] !== null && this.prices['bidSize'] !== null 
    && this.prices['bidPrize'] !== null && this.prices['askSize'] !== null){
      this.marketStatus = true;
    }
    else{
      this.marketStatus = false;
    }
    if(this.prices['mid'] == null){
      this.midVal = false;
    }
  });  
}

  favoriteStock(){
    this.isFavorite = !this.isFavorite;
    if(this.isFavorite){
      this.starred = true;
      this.unstarred = false;
      setTimeout(()=> this.starred = false,5000);
      this.detailsService.tickerinWatchlist(this.ticker,this.details['name']);
    }
    else{
      this.unstarred = true;
      this.starred = false;
      setTimeout(()=> this.unstarred = false,5000);
      this.detailsService.delWatchlistItem(this.ticker);
    }

  }
  displayModal(modal, prices){
    this.globalLast = prices.last;
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' }).result
      .then((result) => { 
        //console.log(result);
        if (result == 'Buy Click') {
          this.buyStock = true;
          setTimeout(() => this.buyStock = false, 5000);
          this.detailsService.addPortfolioToStorage(this.ticker, this.details['name'], this.stockqty, this.cost);
          this.stockqty = null;
          // add the data to localstorage 
        }
      },(reason)=> {
        console.log(reason);
      })
  }

  get cost(){
    if(this.stockqty !== undefined ){
      return this.stockqty*this.globalLast;
    }
    else{
      return 0.00;
    }
  }

  getColor(){
    return this.prices['color'];
  }


}
