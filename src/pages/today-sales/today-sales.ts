import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { LoadingProvider } from '../../providers/loading/loading';
import { ProductProvider } from '../../providers/product/product';

@IonicPage()
@Component({
  selector: 'page-today-sales',
  templateUrl: 'today-sales.html',
})
export class TodaySalesPage {
  todaySoldProduct: any = [];
  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private storage: Storage,
    private loadingProvider: LoadingProvider,
    private productProvider: ProductProvider
  ) {
    let content = 'กำลังเตรียมยอดขายวันนี้...';
    let loader = this.loadingProvider.showLoading(content);
    this.storage.ready().then(() => {
      this.storage.get('AuthToken').then(user => {
        let criteria = {
          "salesmanCode": user.usercode,
        };
        this.productProvider.getTodaySoldProducts(criteria)
          .subscribe((res) => {
            console.log(res);
            this.todaySoldProduct = res;
          }, (err) => {
            console.warn(err);
          }, () => {
            // console.log('finish');
            loader.dismiss();
          });
      });
    })


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TodaySalesPage');
  }

}
