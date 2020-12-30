import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { SearchService } from './search/search.service';
import { MatOptionModule } from '@angular/material/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { DetailsComponent } from './details/details.component';
import {MatTabsModule} from '@angular/material/tabs';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { SummaryComponent } from './summary/summary.component';
import { CommonModule } from '@angular/common';
import { HighchartsChartModule } from 'highcharts-angular';
import { HistoricChartComponent } from './historic-chart/historic-chart.component';
import { NewsComponent } from './news/news.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    HeaderComponent,
    FooterComponent,
    WatchlistComponent,
    PortfolioComponent,
    DetailsComponent, 
    SummaryComponent, HistoricChartComponent, NewsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,

    MatAutocompleteModule,
    NgbModule,
    HighchartsChartModule,
    MatFormFieldModule,
    MatTabsModule,
    MatInputModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    CommonModule,
    HttpClientModule
  ],
  providers: [SearchService, DatePipe],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class AppModule { }
