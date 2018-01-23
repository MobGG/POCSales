import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-create-promotion-modal',
  templateUrl: 'create-promotion-modal.html',
})
export class CreatePromotionModalPage {
  product: any;
  appParam: any;
  premiumProductsList: any[];
  oldValue: any;


  disableButton: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
  ) {
    this.disableButton = true;
    this.product = navParams.get('product');
    this.product.discountPercent = 0;
    this.product.discountAmount = 0;
    this.product.promotionTo = '';
    this.oldValue = {
      'orderB': this.product.orderB,
      'orderP': this.product.orderP,
      'discountPercent': this.product.discountPercent,
      'discountAmount': this.product.discountAmount,
      'specialPrice': this.product.specialPrice,
      // 'premiumTo': this.product.premiumTo
    };
    console.log(this.product);
    this.appParam = navParams.get('appParam');
  }

  ionViewDidLoad() {

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

  order(product: any | null) {
    // console.log('type', typeof product);
    // console.log('product', product);
    if (typeof product === 'object') {
      
      this.viewCtrl.dismiss(product);
    } else {
      this.viewCtrl.dismiss();
    }
  }

}
