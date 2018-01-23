import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ProductModel } from '../../models/product';
import { PromotionProvider } from '../../providers/promotion/promotion'

@IonicPage()
@Component({
  selector: 'page-order-product',
  templateUrl: 'order-product.html',
})

export class OrderProductPage {
  product: any;
  appParam: any;
  promotion: any;
  disableButton: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private promo: PromotionProvider,
  ) {
    this.product = navParams.get('product');
    this.appParam = navParams.get('appParam');
    this.disableButton = true;
    // console.log('chosen product', this.product);
    // console.log('this.appParam', this.appParam);
    this.promo.getPromotionMasterALL(this.appParam, this.product.productCode)
      .subscribe(res => {
        if (res) {
          this.promotion = res;
        }
      }, err => {
        console.warn('error', err);
      }, () => {
        console.log('Fin');
      })
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad OrderProductPage');
    // var divToChange = document.getElementById('my_id');
  }

  order(product: ProductModel | null) {
    // console.log('type', typeof product);
    // console.log('product', product);
    if (typeof product === 'object') {
      this.viewCtrl.dismiss(product);
    } else {
      this.viewCtrl.dismiss();
    }
  }

  validatePackage(product) {
    // validate pack
    product.orderB = Number(product.orderB);
    if (product.orderB > product.qtyB) {
      product.outOfStockB = true;
      this.disableButton = true;
    } else {
      product.outOfStockB = false;
    }
  }

  validatePiece(product) {
    // validate piece
    product.orderP = Number(product.orderP);
    if (product.orderP > (product.qtyB * product.packingSize) + product.qtyP) {
      product.outOfStockP = true;
      this.disableButton = true;
    } else {
      product.outOfStockP = false;
    }
  }

  validateOrder(product) {
    let qtyP = (product.qtyB * product.packingSize) + product.qtyP;
    let orderP = (product.orderB * product.packingSize) + product.orderP;
    if (product.orderB === 0 && product.orderP === 0) {
      this.disableButton = true;
    } else if (orderP > qtyP) {
      product.outOfStockB = true;
      product.outOfStockP = true;
      this.disableButton = true;
    }
    else {
      product.outOfStockB = false;
      product.outOfStockP = false;
      this.disableButton = false;
    }
  }

}