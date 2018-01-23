import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  Platform
} from 'ionic-angular';
import { LoadingProvider } from '../../providers/loading/loading';
// import { ProductProvider } from '../../providers/product/product';
import { PromotionProvider } from '../../providers/promotion/promotion';

@IonicPage()
@Component({
  selector: 'page-promotions-list',
  templateUrl: 'promotions-list.html',
})
export class PromotionsListPage {
  appParam: any;
  allPromotionList: any[] = [];
  showList: any[] = [];
  // must able to search by [productcode, productnamethai, sectioncode, brandname, assortedproductgroup]
  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private platform: Platform,
    private loadingProvider: LoadingProvider,
    private promotionProvider: PromotionProvider
  ) {
    this.appParam = navParams.get('appParam');
    this.getPromotionList();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PromotionsListPage');

  }

  getPromotionList() {
    let content = 'กำลังเตรียมโปรโมชั่น...';
    let loader = this.loadingProvider.showLoading(content);
    this.platform.ready().then(() => {
      let productCode = null;
      this.promotionProvider.getPromotionMasterALL(this.appParam, productCode)
        .subscribe((res) => {
          if (res) {
            console.log('promotionList', res);
            this.allPromotionList = res;
            this.showList = this.allPromotionList;
          }
          loader.dismiss();
        }, (err) => {
          console.warn('error', err);
          loader.dismiss();
        });
    });
  }

  searchPromotion(searchEvent: any) {
    let searchTerm: string = searchEvent.target.value;
    if (searchTerm.trim() != '' && searchTerm.trim().length > 2) {
      this.showList = this.promotionProvider.searchPromotion(searchTerm, this.allPromotionList);
    } else if (searchTerm.trim() != '') {
      this.showList = this.allPromotionList;
    }
  }

  clearSearch(searchEvent: any) {
    this.showList = this.allPromotionList;
    // console.log('this.showList', this.showList);
  }

}
