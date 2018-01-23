import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-my-splash-screen',
  templateUrl: 'my-splash-screen.html',
})
export class MySplashScreenPage {

  constructor(
    private navCtrl: NavController,
    private storage: Storage,
  ) {

  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad MySplashScreenPage');
    let key: string = 'AuthToken';
    this.storage.ready().then(() => {
      this.storage.get(key).then(user => {
        console.log('AuthToken', user);
        if (user) {
          // this.rootPage = 'Tabs';
          // this.navCtrl.setRoot('ChooseProductPage');
          // this.rootPage = 'SellProductPage';
          
          // this.navCtrl.setRoot('Tabs'); // uncoment me
          this.navCtrl.setRoot('MenuPage'); // test stock page
        } else {
          // this.rootPage = 'Login';
          this.navCtrl.setRoot('Login');
        }
      }).catch(err => {
        console.warn(err);
      })
    });
  }
}
