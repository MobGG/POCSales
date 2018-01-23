import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-debt-collect',
  templateUrl: 'debt-collect.html',
})
export class DebtCollectPage {
  debtList: any;
  debtTotal: number;
  payTotal: number;
  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private modalCtrl: ModalController
  ) {
    this.debtList = [
      {
        'billCode': 'C31708030001',
        'amount': '0',
        'pay': '100.90',
        'payStatus': true
      },
      {
        'billCode': 'C31708030002',
        'amount': '100.15',
        'pay': '0',
        'payStatus': false
      },
      {
        'billCode': 'C31708030003',
        'amount': '100.90',
        'pay': '0',
        'payStatus': false
      },
    ]
    this.debtTotal = 0;
    this.payTotal = 0;
    this.calDebtTotal();
    this.calPayTotal();
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad DebtCollectPage');
  }

  calDebtTotal() {
    for (let debt of this.debtList) {
      if (!debt.payStatus) {
        this.debtTotal += +debt.amount;
      }
    }
  }

  calPayTotal() {
    for (let debt of this.debtList) {
      if (debt.payStatus) {
        this.payTotal += +debt.pay;
      }
    }
  }

  pay() {
    let payModal = this.modalCtrl.create('PaymentModalPage', {});
    payModal.onDidDismiss(() => {
      console.log('payModal dsimiss');
    });
    payModal.present();
  }

}
