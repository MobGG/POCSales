import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  constructor(
    private app: App,
    private navCtrl: NavController,
    private navParams: NavParams,
    private platform: Platform,
    private storage: Storage,
    private splashScreen: SplashScreen
  ) {
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.splashScreen.hide();
    }).catch((err) => {
      console.error('platform error', err);
    });
  }

  goToStock() {
    this.navCtrl.push('StockVanPage');
  }

  goToTripsale() {
    this.navCtrl.push('TripSales');
  }

  logout() {
    let key: string = 'AuthToken';
    this.storage.remove(key).then(() => {
      this.app.getRootNav().setRoot('Login');
    })
  }
}
