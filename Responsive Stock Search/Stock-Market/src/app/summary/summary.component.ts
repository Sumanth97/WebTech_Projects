import { Component, OnInit } from '@angular/core';
import { DetailsComponent } from '../details/details.component';
import { Details } from '.././models/details';
import { StockPrice } from '.././models/stock-price';
import {DetailsService } from '../details/details.service';
import {Subscription,Observable, timer} from 'rxjs';
import {map, flatMap, switchMap} from 'rxjs/operators';
import { ChartData } from '.././models/chart-data';
import * as Highcharts from 'highcharts/highstock';
import IndicatorsCore from "highcharts/indicators/indicators";
import vbp from 'highcharts/indicators/volume-by-price';
import { Options } from "highcharts/highstock";
import { DatePipe } from '@angular/common';

IndicatorsCore(Highcharts);
vbp(Highcharts);

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
  details: Details[];
  prices: StockPrice[];
  chartData: ChartData[];
  marketStatus: boolean;
  midVal: boolean;
  ticker: string;
  color: string;
  timestamp: string;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Options = {};
  subscription: Subscription;
  interval: any;

  constructor(private tempComponent: DetailsComponent,private detailsService: DetailsService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.details = this.tempComponent.details;
    this.prices = this.tempComponent.prices;
    this.marketStatus = this.tempComponent.marketStatus;
    this.midVal = this.tempComponent.midVal;
    this.ticker = this.tempComponent.ticker;
    if (this.prices['change'] > 0) {
      this.color = 'green';
    }
    else if (this.prices['change'] < 0) {
      this.color = 'red';
    }
    else {
      this.color = 'black';
    }
    if(this.marketStatus){
      this.timestamp = this.datePipe.transform(this.prices['currentTimestamp'],'yyyy-MM-dd');
    }
    else{
      this.timestamp = this.datePipe.transform(this.prices['timestamp'],'yyyy-MM-dd');
    }
    this.detailsService.getDailyCharts(this.ticker, this.timestamp)
    .subscribe(response => {
      this.chartData = response;
      var datalength = this.chartData.length;
      var stkPrice = [];
    for (var i = 0; i < datalength; i += 1) {
        var date = Date.parse(this.chartData[i]['date']);
       // var date_UTC = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(),date.getUTCMinutes(),date.getUTCSeconds() );      
        stkPrice.push([
           date, this.chartData[i]['close']
        ]);
    }
    this.chartOptions = {
      title: {
        text: this.ticker
      },
      time: {
        useUTC: false,
      },
      rangeSelector: {
        enabled: false
      },

      xAxis:{
        type: 'datetime'
      },

      yAxis:{
        startOnTick: false,
        endOnTick: false,
        // title: {
        //   text: ""
        // },
        // opposite:true,
        // labels:{
        //   align: 'right',
        //   x: 1,
        //   y: -3
        // }
      },
      
      navigator: {
        series: {
          fillOpacity: 0.05,
          color: this.color
        }
      },
      series: [{
        type: 'line',
        name: this.ticker,
        data: stkPrice,
        color: this.color,
        tooltip: {
          valueDecimals: 2
        }
      }]
    }
    if(this.marketStatus == true){
      this.interval = setInterval(() => {
        this.getChart();
      },15000);
    }
    });
  
  }

  getChart(){
    return this.detailsService.getDailyCharts(this.ticker, this.timestamp)
    .subscribe(response => {
      this.chartData = response;
      var datalength = this.chartData.length;
      var stkPrice = [];
    for (var i = 0; i < datalength; i += 1) {
        var date = Date.parse(this.chartData[i]['date']);
       // var date_UTC = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(),date.getUTCMinutes(),date.getUTCSeconds() );      
        stkPrice.push([
           date, this.chartData[i]['close']
        ]);
    }
    this.chartOptions = {
      title: {
        text: this.ticker
      },
      time: {
        useUTC: false,
      },
      rangeSelector: {
        enabled: false
      },

      xAxis:{
        type: 'datetime'
      },

      yAxis:{
        startOnTick: false,
        endOnTick: false,
        // title: {
        //   text: ""
        // },
        // opposite:true,
        // labels:{
        //   align: 'right',
        //   x: 1,
        //   y: -3
        // }
      },
      
      navigator: {
        series: {
          fillOpacity: 0.05,
          color: this.color
        }
      },
      series: [{
        type: 'line',
        name: this.ticker,
        data: stkPrice,
        color: this.color,
        tooltip: {
          valueDecimals: 2
        }
      }]
    }
    });

  }
  ngOnDestroy() {
    // this.subscription.unsubscribe();
    
      if (this.interval) {
        clearInterval(this.interval);
      }
   
}
}
