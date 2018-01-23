import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StockHistoryPage } from './stock-history';

@NgModule({
  declarations: [
    StockHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(StockHistoryPage),
  ],
})
export class StockHistoryPageModule {}
