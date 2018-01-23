import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TripSales } from './trip-sales';

@NgModule({
  declarations: [
    TripSales,
  ],
  imports: [
    IonicPageModule.forChild(TripSales),
  ],
  exports: [
    TripSales
  ],
})
export class TripSalesModule { }
