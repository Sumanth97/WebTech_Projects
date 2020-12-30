import { Component, OnInit } from '@angular/core';
import { NewsService } from './news.service';
import {NewsData} from '../models/news-data';
import { DetailsComponent } from '../details/details.component';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  newsData: NewsData[];
  article: NewsData;
  leftcol: any[];
  rightcol: any[];
  ticker: string;

  constructor(private newsservice:NewsService,private tempComponenet: DetailsComponent,private modalService: NgbModal) { }

  ngOnInit(): void {
    this.ticker = this.tempComponenet.ticker;
    this.newsservice.getNewsData(this.ticker)
    .subscribe(response => {
      this.newsData = response['articles'];
      var datalength = this.newsData.length;
      var data_left = [];
      var data_right = [];
      for(var i = 0; i < datalength ; i+=1){
        if(i%2 == 0){
          data_left.push(this.newsData[i]);
        }
        else{
          data_right.push(this.newsData[i]);
        }
      }
      this.leftcol = data_left;
      this.rightcol = data_right;
    });
  }

  displayNewsModal(modal, article){
    this.article = article;
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' }).result
      .then((result) => { 
        console.log(result);
       
      },(reason)=> {
        console.log(reason);
      })
  }

}
