import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-stock-history',
  templateUrl: 'stock-history.html',
})
export class StockHistoryPage {
  appParam: any;
  type: string = 'get';
  form51s: any[];
  form52s: any[];

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StockHistoryPage');
  }

}
