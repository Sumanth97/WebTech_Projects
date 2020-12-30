import { Component, OnInit } from '@angular/core';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SearchService } from '../search/search.service';
import { FormControl } from '@angular/forms';
import { Stocks } from '.././models/Stocks';
import {switchMap, debounceTime, tap, finalize} from 'rxjs/operators';
import { Router } from '@angular/router';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  
  control:FormControl = new FormControl();
  stocks: Stocks[];
  isLoading = false;
  //streets: string[] = [];//['Champs-Élysées', 'Lombard Street', 'Abbey Road', 'Fifth Avenue'];
  //: Observable<string[]>;

  constructor(private searchService:SearchService, private route:Router){
  
  }
 ngOnInit() {

   this.control.valueChanges
   .pipe(
    debounceTime(300),
    tap(() => this.isLoading = true),
    switchMap(value => this.searchService.getAllSuggestions(this.control.value)
    .pipe(
      finalize(() => this.isLoading = false),
      )
    )
  )
  // .subscribe(control => this.searchService.getAllSuggestions(this.control.value)
   .subscribe(response => this.stocks = response);
  //  this.streets = this.stocks.;
  // this.filteredStreets = this.control.valueChanges
  // .pipe(
  //   startWith(''),
  //   map(value => this._filter(value))
  // );
  }
  // private _filter(value: string): string[] {
  //   const filterValue = this._normalizeValue(value);
  //   return this.streets.filter(street => this._normalizeValue(street).includes(filterValue));
  // }

  // private _normalizeValue(value: string): string {
  //   return value.toLowerCase().replace(/\s/g, '');
  // }
  
  displayStock(name: Stocks){
    if (name) {
      return name.ticker;
    }
  }

  navigateRoute(id: string){
    let text = (document.getElementById(id) as HTMLInputElement).value;
    this.route.navigate(['/details', text.split("|")[0]]);
  }
  
}
