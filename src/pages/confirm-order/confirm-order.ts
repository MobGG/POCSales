import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ProductProvider } from '../../providers/product/product';

@IonicPage()
@Component({
  selector: 'page-confirm-order',
  templateUrl: 'confirm-order.html',
})
export class ConfirmOrderPage {
  appParam: any;
  sampleData: any;
  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private productProvider: ProductProvider
  ) {
    this.appParam = navParams.get('appParam');
    console.log('this.appParam', this.appParam);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfirmOrderPage test');
  }

  confirmOrder() {
    // poduct แต่ละอัน ต้องถอด vat
    this.productProvider.saveb2bTSpcSoSaleOrder(this.appParam)
      .subscribe(res => {
        // console.log('appParam model', this.appParam);
        console.log(res);
      })
  }

}
