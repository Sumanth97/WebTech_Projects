import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DetailsService } from '../details/details.service';
import { Watchlist } from '.././models/watchlist';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  stockList = [];
  isempty: boolean;
  stockList_data: object;
  globalLast: number;
  stockqty: number; // no. of stocks with me
  ticker: string;
  current_qty: number; // no.of stocks wanting to buy or sell
  pageLoading:boolean = true;

  constructor(private detailsService: DetailsService, private detectChange: ChangeDetectorRef, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.stockList = JSON.parse(localStorage.getItem("stockList"))
    if (this.stockList === null || this.stockList.length == 0) {
      this.isempty = true;
      this.pageLoading = false;
    }
    else if (this.stockList.length > 0) {
      this.isempty = false;
      this.stockList = this.stockList.sort();
      var data = [];
      //console.log(this.stockList);
      this.detailsService.getLatestPortfolioData(this.stockList)
        .subscribe(response => {
          this.stockList_data = response;
          //console.log(response);
          this.pageLoading = false;
        });
    }
  }

  displayModal(modal, ticker, data) {
    this.ticker = ticker;
    this.globalLast = data.last;
    this.stockqty = data.stockqty
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' }).result
      .then((result) => {
        if (result == 'Buy Click') {
          this.detailsService.addPortfolioToStorage(this.ticker, data['name'], this.current_qty, this.cost);
          this.detailsService.getLatestPortfolioData(this.stockList)
              .subscribe(response => {
                this.stockList_data = response;
                //console.log(response);
              });
          this.current_qty = null;
        }
        else if (result == "Sell Click") {
          this.detailsService.popStock(this.ticker, this.current_qty);
          this.stockList = JSON.parse(localStorage.getItem('stockList'));
          if (this.stockList === null || this.stockList.length == 0) {
            this.isempty = true;
          }
          else if (this.stockList.length > 0) {
            this.isempty = false;
            this.stockList = this.stockList.sort();
            this.detailsService.getLatestPortfolioData(this.stockList)
              .subscribe(response => {
                this.stockList_data = response;
                //console.log(response);
              });
          }
          this.current_qty = null;
        }
        this.detectChange.detectChanges();
      }, (reason) => {
        console.log(reason);
      })
  }

  get cost() {
    if (this.current_qty !== undefined) {
      return this.current_qty * this.globalLast;
    }
    else {
      return 0.00;
    }
  }

}
