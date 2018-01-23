import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StockVanPage } from './stock-van';

@NgModule({
  declarations: [
    StockVanPage,
  ],
  imports: [
    IonicPageModule.forChild(StockVanPage),
  ],
  exports: [
    StockVanPage
  ],
})
export class StockVanPageModule { }
