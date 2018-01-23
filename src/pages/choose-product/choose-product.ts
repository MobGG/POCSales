import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform } from 'ionic-angular';

// Observable operators
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { ProductModel } from '../../models/product'

import { LoadingProvider } from '../../providers/loading/loading';
import { ProductProvider } from '../../providers/product/product';

@IonicPage()
@Component({
  selector: 'page-choose-product',
  templateUrl: 'choose-product-new.html',
})

export class ChooseProductPage {
  appParam: any;
  products: ProductModel[];

  searchResult: number;
  cart: any[];

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private platform: Platform,
    private loadingProvider: LoadingProvider,
    private productProvider: ProductProvider,
  ) {
    console.log('welcome to choose product page');
    this.appParam = navParams.get('appParam');
    console.log('appParam', this.appParam);
  }

  // can search by productCode and productName
  search(ev: any): void {
    let content = 'กำลังค้นหาสินค้า...';

    let text: string = ev.target.value;
    if (typeof text === 'string' && text.trim() !== '' && text.trim().length > 2) {
      let loader = this.loadingProvider.showLoading(content);
      let criteria = {
        // "salesmanCode": 'C461',
        // "productCode": '221',
        "salesmanCode": this.appParam.salesman.usercode,
        "productCode": text.trim(),
      }
      let option: string = 'onHand';
      this.productProvider.getStockVanMaster(criteria, option)
        .debounceTime(1000)
        .distinctUntilChanged()
        .subscribe((stockVan) => {
          // console.log('stockVan', stockVan);
          // console.log('count', stockVan.length);
          this.searchResult = stockVan.length;
          this.products = stockVan;
        }, (err) => {
          console.warn('error', err);
        }, () => {
          loader.dismiss();
        });
    } else {
      this.searchResult = 0;
      this.products = [];
    }
  }

  ionViewDidLoad() {
    this.cart = [];
    // this.cartStatus = true;
    this.platform.ready().then(() => { });
  }

  orderProduct(product) {
    // console.log('product', product);
    let order: any = JSON.parse(JSON.stringify(product));// new object with value js object always reference paraeent

    let oldProductCode: string = "";
    this.cart.forEach(productInCart => {
      if (order.productCode === productInCart.productCode) {
        oldProductCode = productInCart.productCode;
        order = JSON.parse(JSON.stringify(productInCart));
        // console.log('order', order);
      }
    });

    let orderModal = this.modalCtrl.create('OrderProductPage', { product: order });
    orderModal.present();
    orderModal.onDidDismiss((order: ProductModel) => {
      if (order != null) {
        this.cart.forEach(product => {
          if (order.productCode === product.productCode) {
            product.orderB = order.orderB;
            product.orderP = order.orderP;
          }
        });
        if (!oldProductCode) {
          this.cart.push(order);
        }
      }
    });
  }

  editOrder(product) {
    let order = JSON.parse(JSON.stringify(product));
    let orderModal = this.modalCtrl.create('OrderProductPage', { product: order });
    orderModal.present();
    orderModal.onDidDismiss((order: ProductModel) => {
      if (order != null) {
        product.orderB = order.orderB;
        product.orderP = order.orderP;
        // order.sumPrice = (order.orderB * order.unitPrice) + (order.orderP * order.piecePrice);
        // product.sumPrice = order.sumPrice;
      }
    });
  }

  removeFormCart(event, productIndex) {
    console.log(this.cart);
    event.stopPropagation();
    // this.cart[productIndex].productInCart = true;
    // this.products[productIndex].productInCart = true;
    this.cart.splice(productIndex, 1);
  }

  pushSellPage(): void {
    // console.log('cart', this.cart);
    this.appParam.cart = this.cart;
    this.navCtrl.push('SellProductPage', { 'appParam': this.appParam });
  }

}
