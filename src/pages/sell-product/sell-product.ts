import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams, Platform } from 'ionic-angular';
import { LoadingProvider } from '../../providers/loading/loading';

import { VansalesProvider } from '../../providers/vansales/vansales';
import { HelperProvider } from '../../providers/helper/helper';

@IonicPage()
@Component({
  selector: 'page-sell-product',
  templateUrl: 'sell-product.html',
})

export class SellProductPage {
  appParam: any;
  cart: any;
  total: number;
  rewards: any;
  rewardText: any = [];
  disableCalBtn: boolean;
  disableNextPageBtn: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private loadingProvider: LoadingProvider,
    private platform: Platform,
    
    private vansalesProvider: VansalesProvider,
    private helper: HelperProvider,
  ) {
    this.appParam = navParams.get('appParam');
    this.total = 0;
    // this.checkPromotionC4();
    this.disableNextPageBtn = true;
    console.log('appParam', this.appParam);
  }

  ionViewDidLoad() {

  }

  editOrder(productOrder) {
    let createPromotion = this.modalCtrl.create('OrderProductPage', { product: productOrder, appParam: this.appParam });
    createPromotion.present();
    createPromotion.onDidDismiss((product) => {
      if (product) {
        productOrder.orderB = product.orderB;
        productOrder.orderP = product.orderP;
      }
    });
  }

  checkPromotionC4() {
    let content = 'กำลังคิดโปรโมชัน...';
    let loader = this.loadingProvider.showLoading(content);

    this.vansalesProvider.checkPromotionC4(this.appParam)
      .subscribe(res => {
        if (res.orderDtlpromotion) {
          // console.log('orderDtlpromotion', res.orderDtlpromotion);
          let promotion = res.orderDtlpromotion;
          this.appParam.promotion = promotion;
          // console.log('appParam', this.appParam);

          let productList: any[] = [];
          this.appParam.cart = this.setDiscountToCartProduct(this.appParam.cart, this.appParam.promotion);
          productList = this.combineProduct(this.appParam.cart, this.appParam.promotion);
          // this.appParam.stock = productList;


          this.checkStockOnline(productList);

          console.log('cart', this.appParam.cart);
          console.log('promotion', this.appParam.promotion);
          console.log('productList', productList);


          this.getTotal(this.appParam.cart);
          loader.dismiss();
        } else {
          // console.log('mock return promotion', 'fixed discount and premium');
          // for (let i = 0; i < this.appParam.cart.length; i++) {
          //   this.appParam.cart[i].discount = 100;
          //   this.appParam.cart[i].totalPrice = this.appParam.cart[i].sumPrice - this.appParam.cart[i].discount;

          //   this.appParam.cart[i].premiumProduct = {
          //     'premiumProductCode': this.appParam.cart[i].productCode,
          //     'premiumProductName': this.appParam.cart[i].palmProductNamet,
          //     'premiumProductPackingSize': this.appParam.cart[i].packingSize,
          //     'premiumProductQty': 1,
          //     'premiumProductUnit': 'B',
          //   }

          // }
          // console.log('cart after mock promotion', this.appParam.cart);
          // this.getTotal(this.appParam.cart);

          // loader.dismiss();
        }

      });
  }

  setDiscountToCartProduct(cart, promotion): any[] {
    for (let cartProduct of cart) {
      for (let promotionProduct of promotion) {
        // todo put in loop combine cart and promotion
        if (cartProduct.productCode === promotionProduct.productCode) {
          cartProduct.sumPrice = (+cartProduct.orderB) * (+cartProduct.unitPrice) + (+cartProduct.orderP) * (+cartProduct.piecePrice);
          cartProduct.discount = (+promotionProduct.discountCalcAmount);
          cartProduct.totalPrice = cartProduct.sumPrice - cartProduct.discount;
        }
      }
    }
    return cart;
  }

  combineProduct(cart, promotion): any[] {
    let productList: any[] = [];
    let productModel: any = {
      "txtWarehouseCode": "",
      "txtProductCode": "",
      "txtQty": 0,
    };
    let existProduct: boolean = false;

    for (let product of promotion) {
      if (!this.helper.isEmpty(product.premiumproduct)) {
        // check premiumProductSize 'B'=0 or 'P'=9
        if (product.premiumunit === 'P') {
          productModel = {
            "txtWarehouseCode": cart[0].warehouseCode,
            "txtProductCode": product.premiumproduct,
            "txtQty": +(product.freepremiumquantity)
          }
          productList.push(productModel);
        } else if (product.premiumunit === 'B') {
          productModel = {
            "txtWarehouseCode": cart[0].warehouseCode,
            "txtProductCode": product.premiumproduct,
            "txtQty": (+product.freepremiumquantity) * (+product.premiumpackingsize)
          }
          productList.push(productModel);
        }
      }
    }
    for (let cartProduct of cart) {
      for (let product of productList) {
        if (cartProduct.productCode === product.txtProductCode) {
          product.txtQty += +(cartProduct.orderB * cartProduct.packingSize) + (+cartProduct.orderP);
          existProduct = true;
          break;
        }
      }
      if (!existProduct) {
        productModel = {
          "txtWarehouseCode": cartProduct.warehouseCode,
          "txtProductCode": cartProduct.productCode,
          "txtQty": +(cartProduct.orderB * cartProduct.packingSize) + (+cartProduct.orderP)
        }
        productList.push(productModel);
      }
      // console.log('cart', cart);
      // console.log('promotion', promotion);
      // console.log('productList', productList);
    }
    return productList;
  }

  checkStockOnline(productList) {
    for (let i = 0; i < productList.length; i++) {
      // cannot reproduce bug when buy product a get freePremium b 
      // but after checkStock freePremium b status = N need more time and test data
      this.vansalesProvider.checkStock(productList[i])
        .subscribe(status => {
          if (status) {
            productList[i].status = status;

            for (let j = 0; j < this.appParam.cart.length; j++) {
              if (productList[i].txtProductCode === this.appParam.cart[j].productCode) {
                productList[i].status = status;
                if (status === 'Y') {
                  this.appParam.cart[j].outOfStockB = false;
                  this.appParam.cart[j].outOfStockP = false;
                  this.disableNextPageBtn = false;
                } else if (status === 'N') {
                  this.appParam.cart[j].outOfStockB = true;
                  this.appParam.cart[j].outOfStockP = true;
                  this.disableNextPageBtn = true;
                  // break;
                }
              } else {
                productList[i].status = status;
              }
            }
            if (productList[i].status === 'N') {
              this.disableNextPageBtn = true;
              return false;
            }
          } else {
            console.warn('network error!?');
          }
        });

    }

  }

  getTotal(cart) {
    this.total = 0;
    if (cart) {
      for (let i = 0; i < cart.length; i++) {
        this.total += cart[i].totalPrice;
      }
    }
  }

  removeFormCart(productIndex) {
    this.appParam.cart.splice(productIndex, 1);
    this.disableNextPageBtn = true;
    console.log(this.appParam.cart);
  }

  pushConfirmOrderPage() {
    console.log('appParam', this.appParam);
    // ราคาสินค้ารวม vat อยู่แล้ว พี่หนึ่งบอก
    let vat = 7;
    let vatAmount = (this.total * vat) / 100;
    let total = this.total - vatAmount;
    let netTotal = this.total;
    this.appParam.money = {
      "total": total,
      "vat": vat,
      "vatAmount": vatAmount,
      "netTotal": netTotal
    }
    this.navCtrl.push('ConfirmOrderPage', { 'appParam': this.appParam });
  }

}
