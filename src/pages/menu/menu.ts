import { Component } from '@angular/core';
import { App, IonicPage, NavController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Observable } from "rxjs";
import { IntervalObservable } from "rxjs/observable/IntervalObservable";

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  appParam: any;

  constructor(
    private app: App,
    private navCtrl: NavController,
    private platform: Platform,
    private storage: Storage,
    private splashScreen: SplashScreen
  ) {
    // IntervalObservable.create(3000).subscribe(() => {
    //   console.log("test");
    // });
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.splashScreen.hide();
    }).catch((err) => {
      console.error('platform error', err);
    });
  }

  goToStockHistory() {
    this.navCtrl.push('StockHistoryPage');
  }

  goToGetProduct() {
    this.navCtrl.push('GetProductPage');
  }

  goToReturnProduct() {
    this.navCtrl.push('ReturnProductPage');
  }

  goToTarget() {
    this.navCtrl.push('Target');
  }

  goToCollectPay() {
    this.navCtrl.push('DebtCollectPage');
  }

  goToPayment() {
    this.navCtrl.push('PaymentPage');
  }

  goToPaymentModal() {
    this.navCtrl.push('PaymentModalPage');
  }

  goToTripsale() {
    this.navCtrl.setRoot('TripSales');
  }

  goToCustomPromotion() {
    this.navCtrl.push('CustomPromotionPage');
  }

  logout() {
    let key: string = 'AuthToken';
    this.storage.remove(key).then(() => {
      this.app.getRootNav().setRoot('Login');
    })
  }
}
