import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-payment-modal',
  templateUrl: 'payment-modal.html',
})
export class PaymentModalPage {

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private viewCtrl: ViewController,
  ) {

  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad PaymentModalPage');
  }

  paymentCancel() {
    this.viewCtrl.dismiss();
  }

  paymentConfirm() {
    this.viewCtrl.dismiss();
  }

}
