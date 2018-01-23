import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  rootPage: string = 'MySplashScreenPage';

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
  ) {
    console.log('App Component constructor');
    // this.storageProvider.load('AuthToken').then((val: any) => {
    //   console.log('AuthToken', val);
    //   if (val) {
    //     this.rootPage = 'Tabs';
    //     // this.rootPage = 'ChooseProductPage';
    //     // this.rootPage = 'SellProductPage';
    //   } else {
    //     this.rootPage = 'Login';
    //   }
    //   console.log('rootPage', this.rootPage);
    //   this.platform.ready().then(() => {
    //     this.statusBar.styleDefault();
    //     this.splashScreen.hide();
    //   });
    // });
  }

  // ionViewDidLoad() {
  //   console.log('App Component view did load');
  //   this.storageProvider.load('AuthToken').then((val: any) => {
  //     console.log('AuthToken', val);
  //     if (val !== null) {
  //       this.rootPage = 'Tabs';
  //     } else {
  //       this.rootPage = 'Login';
  //     }
  //     console.log('rootPage', this.rootPage);
  //     this.platform.ready().then(() => {
  //       this.statusBar.styleDefault();
  //       this.splashScreen.hide();
  //     });
  //   }).catch(() => {
  //     this.rootPage = 'Login';
  //   });
  // }

}

