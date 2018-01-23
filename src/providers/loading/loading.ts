import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class LoadingProvider {
  
  constructor(private loadingCtrl: LoadingController) {
    // console.log('Hello LoadingProvider Provider');
  }

  // spinnerValue = {
  //   ios,
  //   ios-small,
  //   bubbles,
  //   circles,
  //   crescent,
  //   dots
  // }

  showLoading(content: string) {
    let loader = this.loadingCtrl.create({
      spinner: 'circles',
      content: content
    });
    loader.present();
    return loader;
  }

}
