import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, ToastController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { LoadingProvider } from '../../providers/loading/loading';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class Login {
  loading: any;
  userCred = {
    'username': '',
    'password': ''
  };
  constructor(
    private navCtrl: NavController,
    private platform: Platform,
    private toastCtrl: ToastController,
    private splashScreen: SplashScreen,
    private storage: Storage,
    private loadingProvider: LoadingProvider,
    private authProvider: AuthProvider,
  ) {
    this.platform.ready().then(() => {
      this.splashScreen.hide();
    });
  }

  ionViewDidLoad() { }

  authenticate(userCred: any) {
    if (userCred.username == null || userCred.password == null || userCred.username.trim() == '' || userCred.password.trim() == '') {
      alert('โปรดกรอกข้อมูล');
    } else {
      let content = 'กำลังครวจสอบ...';
      let loader = this.loadingProvider.showLoading(content);
      this.authProvider.authenticate(userCred).subscribe((user) => {
        console.log('user', user);
        if (user) {
          let key: string = 'AuthToken';
          let value: any = user;
          this.storage.set(key, value).then(() => {
            
            // this.navCtrl.setRoot('Tabs');
            this.navCtrl.setRoot('MenuPage');
            
          });
        }
        else {
          // loader.dismiss().then(() => {
          let toast = this.toastCtrl.create({
            message: 'รหัสผู้ใช้งาน หรือ รหัสผ่านไม่ถูกต้อง',
            duration: 3000,
            position: 'top'
          });
          toast.present();
          // });
        }
      }, err => {
        console.warn('error', err);
        // loader.dismiss().then(() => {
        let toast = this.toastCtrl.create({
          message: 'โปรดตรวจสอบสัญญาณ internet',
          duration: 3000,
          position: 'top'
        });
        toast.present();
        loader.dismiss();
        // })
      }, () => {
        console.log('authenticate complete');
        loader.dismiss();
      })
    }
  }

}
