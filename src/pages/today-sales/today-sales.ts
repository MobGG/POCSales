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
    this.sumTodaySoldProducts();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TodaySalesPage');
  }

  sumTodaySoldProducts() {
    let content = 'กำลังเตรียมยอดขายวันนี้...';
    let loader = this.loadingProvider.showLoading(content);
    this.storage.ready().then(() => {
      this.storage.get('AuthToken').then(user => {
        let criteria = {
          "salesmanCode": user.usercode,
        };
        // หาสินค้าทั้งหมดที่ขายไปในวันนี้ แบบรวมมาแล้ว
        this.productProvider.getTodaySoldProducts(criteria)
          .subscribe((res) => {
            console.log(res);
            this.todaySoldProduct = res;
            // เอารหัสสินค้าไป join ชื่อ
            // this.productProvider.getProductMasterCharacteristic()
            //   .subscribe((res) => {

            //   })
          }, (err) => {
            console.warn(err);
            loader.dismiss();
          }, () => {
            // console.log('finish');
            loader.dismiss();
          });
      });
    })
  }
}
