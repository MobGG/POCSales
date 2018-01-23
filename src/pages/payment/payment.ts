import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private modalCtrl: ModalController
  ) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad PaymentPage');
  }

  pay() {
    let payModal = this.modalCtrl.create('PaymentModalPage', {});
    payModal.onDidDismiss(() => {
      console.log('payModal dsimiss');
    });
    payModal.present();
  }


}
