import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfirmOrderPage } from './confirm-order';

@NgModule({
  declarations: [
    ConfirmOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(ConfirmOrderPage),
  ],
  exports: [
    ConfirmOrderPage
  ]
})
export class ConfirmOrderPageModule {}
