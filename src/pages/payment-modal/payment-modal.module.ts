import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentModalPage } from './payment-modal';

@NgModule({
  declarations: [
    PaymentModalPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentModalPage),
  ],
})
export class PaymentModalPageModule {}
