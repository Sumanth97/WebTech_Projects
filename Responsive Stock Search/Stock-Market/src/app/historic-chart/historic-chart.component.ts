import { Component, OnInit } from '@angular/core';
import { HistoricChartService } from '../historic-chart/historic-chart.service';
import { DetailsComponent } from '../details/details.component';
import { HistoricData } from '.././models/historic-data';
import * as Highcharts from 'highcharts/highstock';
import { Options } from "highcharts/highstock";
import IndicatorsCore from "highcharts/indicators/indicators";
import vbp from 'highcharts/indicators/volume-by-price';

IndicatorsCore(Highcharts);
vbp(Highcharts);

@Component({
  selector: 'app-historic-chart',
  templateUrl: './historic-chart.component.html',
  styleUrls: ['./historic-chart.component.css']
})
export class HistoricChartComponent implements OnInit {

  historyChart: HistoricData[];
  ticker: string;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Options = {};
  data: any[];

  constructor(private historyService: HistoricChartService, private tempComponent : DetailsComponent) {  
  }

  ngOnInit(): void {
    this.ticker = this.tempComponent.ticker;
    this.historyService.getHistoricCharts(this.ticker)
    .subscribe(response => {
      this.historyChart = response;
      var ohlc = [];
      var volume = [];
      var datalength = this.historyChart.length;
      for (var i = 0; i < datalength; i += 1) {
          var date = new Date(this.historyChart[i]['date']);
          var date_UTC = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
          ohlc.push([
              date_UTC, this.historyChart[i]['open'],this.historyChart[i]['high'],
              this.historyChart[i]['low'],this.historyChart[i]['close']
          ]);
          volume.push([
            date_UTC,this.historyChart[i]['volume']
          ]);
      } 
      this.data = [];
      this.data.push(ohlc);
      this.data.push(volume);
    this.chartOptions = {
      title: {
        text: this.ticker + ' Historical'
    },
  
    subtitle: {
        text: 'With SMA and Volume by Price technical indicators'
    },
    rangeSelector: {
        allButtonsEnabled: true,
        selected: 2
    },  
  

    yAxis: [{
        startOnTick: false,
        endOnTick: false,
        labels: {
            align: 'right',
            x: -3
        },
        title: {
            text: 'OHLC'
        },
        height: '60%',
        lineWidth: 2,
        resize: {
            enabled: true
        }
    }, {
        labels: {
            align: 'right',
            x: -3
        },
        title: {
            text: 'Volume'
        },
        top: '65%',
        height: '35%',
        offset: 0,
        lineWidth: 2
    }],
  
    tooltip: {
        split: true
    },
  
    plotOptions: {
        
        series: {
            dataGrouping: {
                units: [[
                    'week',                         
                    [1]                             
                ], [
                    'month',
                    [1, 2, 3, 4, 6]
                ]]
            }
        }
    },
  
    series: [{
        type: 'candlestick',
        name: this.ticker,
        id: 'tckr_name',
        zIndex: 2,
        data: this.data[0]
    }, {
        type: 'column',
        name: 'Volume',
        id: 'volume',
        data: this.data[1],
        yAxis: 1
    }, {
        type: 'vbp',
        linkedTo: 'tckr_name',
        params: {
            volumeSeriesID: 'volume'
        },
        dataLabels: {
            enabled: false
        },
        zoneLines: {
            enabled: false
        }
    }, {
        type: 'sma',
        linkedTo: 'tckr_name',
        zIndex: 1,
        marker: {
            enabled: false
        }
    }]
    };
  
  
  });

  }

  
}
