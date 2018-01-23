import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PromotionsListPage } from './promotions-list';

@NgModule({
  declarations: [
    PromotionsListPage,
  ],
  imports: [
    IonicPageModule.forChild(PromotionsListPage),
  ],
  exports: [
    PromotionsListPage
  ]
})
export class PromotionsListPageModule { }
