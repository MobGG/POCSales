import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChooseProductPage } from './choose-product';

@NgModule({
  declarations: [
    ChooseProductPage,
  ],
  imports: [
    IonicPageModule.forChild(ChooseProductPage),
  ],
  exports: [
    ChooseProductPage
  ]
})
export class ChooseProductPageModule {}
