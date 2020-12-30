import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { componentFactoryName } from '@angular/compiler';
import { AppComponent } from './app.component';
import {SearchComponent} from './search/search.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { DetailsComponent } from './details/details.component';

const routes: Routes = [
  {
    path: "",
    component: SearchComponent
  },
  
  {
    // path: '',
    // component: AppComponent,
    // children: [{
      path: 'watchlist',
      component: WatchlistComponent
    },
  {
    path: 'portfolio',
    component: PortfolioComponent
  },
  {
    path: 'details/:ticker',
    component: DetailsComponent
  }
// ]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
