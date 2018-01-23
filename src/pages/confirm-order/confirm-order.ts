import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Diagnostic } from '@ionic-native/diagnostic';

import { ProductProvider } from '../../providers/product/product';

declare var startApp;
@IonicPage()
@Component({
  selector: 'page-confirm-order',
  templateUrl: 'confirm-order.html',
})
export class ConfirmOrderPage {
  appParam: any;
  sampleData: any;

  // packageName: string = 'com.kasikornbank.retail.kmerchant';
  packageName: string = 'PrintSPC.com.ari';
  bluetoothIsEnabled: boolean;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private diagnostic: Diagnostic,
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
    this.productProvider.saveb2bTSpcSoSaleOrder(this.appParam).subscribe(salesOrderNo => {
      // console.log('appParam model', this.appParam);
      console.log(salesOrderNo);// res = sono : salesOrderNo
      this.appParam.stock.txtDocumentNo = salesOrderNo;
      this.appParam.stock.txtTransBy = this.appParam.salesman.usercode;
      let allReserveSuccess: boolean = true;
      for (let stock of this.appParam.stock) {
        this.productProvider.reserveCenterStockProductBalance(stock).subscribe(res => {
          if (!res) {
            console.warn('Result', res);
            console.warn('product', stock);
          } else {
            allReserveSuccess = res;
          }
        })
      }
      if (allReserveSuccess) {
        console.log('allReserveSuccess', allReserveSuccess);
        // TODO cutStock here

      }
    });

  }

  launchPrintApp() {
    // let appStarter = (window as any).startApp.set({
    let appStarter = startApp.set({
      "intentstart": "startActivityForResult",
      "action": "ACTION_MAIN",
      "package": this.packageName,
    });
    appStarter.start((msg) => {
      console.log('starting BB app: ' + msg);
    }, (err) => {
      console.log('BB app not installed', err);
      // window.open(myConstants.blackboardApp.android.storeUrl, '_system');
    });
  }

  listennerBluetoothStatus() {
    this.diagnostic.registerBluetoothStateChangeHandler(function (state) {
      // "unknown", "resetting", "unsupported", "unauthorized", "powered_off", "powered_on"
      if (state === 'powered_on') {
        this.bluetoothIsEnabled = true;
        alert('bluetoothIsEnabled is ' + this.bluetoothIsEnabled);
      } else if (state === 'powered_off') {
        this.bluetoothIsEnabled = false;
        alert('bluetoothIsEnabled is ' + this.bluetoothIsEnabled);
      }
      console.log('bluetoothIsEnabled is ', this.bluetoothIsEnabled);
    });
  }

  testLaunchAndListener() {
    this.launchPrintApp();
    this.listennerBluetoothStatus();
  }

  goToPayment() {
    this.navCtrl.push('PaymentPage');
  }

}
