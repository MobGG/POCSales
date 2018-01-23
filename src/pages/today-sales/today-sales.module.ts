import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TodaySalesPage } from './today-sales';

@NgModule({
  declarations: [
    TodaySalesPage,
  ],
  imports: [
    IonicPageModule.forChild(TodaySalesPage),
  ],
  exports: [
    TodaySalesPage
  ]
})
export class TodaySalesPageModule {}
