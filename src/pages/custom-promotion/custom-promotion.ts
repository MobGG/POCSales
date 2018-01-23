import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  ModalController,
  LoadingController,
  AlertController
} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { VansalesProvider } from '../../providers/vansales/vansales';

@IonicPage()
@Component({
  selector: 'page-custom-promotion',
  templateUrl: 'custom-promotion.html',
})
export class CustomPromotionPage {
  appParam: any;
  view: string = 'product';
  warehouseCode: string = "";
  searchText: string = "";

  productsList: any[];
  cart: any[];
  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private storage: Storage,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private vansalesProvider: VansalesProvider
  ) {
    this.productsList = [];
    this.cart = [];
  }

  ionViewDidLoad() {
    let authKey: string = 'AuthToken';
    this.storage.ready().then(() => {
      this.storage.get(authKey).then(user => {
        let param: any = {
          'salesman': user,
          'customer': {},
          'cart': {},
          'money': {},
          'paymentInfo': {}
        }
        this.appParam = param;
        this.warehouseCode = param.salesman.usercode;
      });
    });
  }

  search() {
    let searchText: string = this.searchText;
    if (typeof searchText === 'string' && searchText.trim() !== '') {
      let loader = this.loadingCtrl.create({
        spinner: 'circles',
        content: 'กำลังค้นหาสินค้า...'
      });
      let criteria = {
        "salesmanCode": this.warehouseCode,
        "productCode": searchText.trim(),
      }
      let option: string = 'onHand';
      this.vansalesProvider.getStockVanMaster(criteria, option)
        .subscribe((res) => {
          console.log('api res', res);
          this.productsList = res;
        }, (err) => {
          console.warn('error', err);
          loader.dismiss();
        }, () => {
          loader.dismiss();
        });
    } else {
      this.productsList = [];
    }
  }

  findPickedProduct(productCode: string, cart: any): any {
    let res = {
      'oldIndex': '',
      'oldProduct': {}
    }
    for (let i = 0; i < cart.length; i++) {
      if (productCode === cart[i].productCode) {
        console.log(productCode === cart[i].productCode);
        res.oldIndex = i.toString();
        res.oldProduct = JSON.parse(JSON.stringify(cart[i]));
        break;
      }
    }
    return res;
  }

  getOnlyBuyProduct(cart: any[]): any[] {
    let buyList: any[] = [];
    for (let product of cart) {
      if (product.promotionTo === '') {
        buyList.push(product.productCode);
      }
    }
    return buyList;
  }

  presentAlert(product: any) {
    const alert = this.alertCtrl.create({
      title: 'Confirm purchase',
      message: 'Do you want to buy this book?',
      buttons: [
        {
          text: 'ยกเลิก',
          role: 'cancel',
          handler: () => {
      
          }
        }, {
          text: 'อัพเดท',
          handler: () => {
            console.log('update old product');
          }
        }, {
          text: 'เพิ่มสินค้า',
          handler: () => {
            this.cart.push(product);
          }
        }
      ]
    });
    alert.present(product);
  }

  order(product) {

    // let res = this.findPickedProduct(product.productCode, this.cart);
    // let buyList: any[] = this.getOnlyBuyProduct(this.cart);
    // let oldIndex: string = '';
    // let order: any;

    // if (res.oldIndex) {
    //   oldIndex = res.oldIndex;
    //   order = res.oldProduct;
    // } else {
    //   // new object with value js object always reference paraent
    //   order = JSON.parse(JSON.stringify(product));
    // }

    // let createPromotion = this.modalCtrl.create('CreatePromotionModalPage', { product: order, appParam: this.appParam });
    // createPromotion.onDidDismiss((product) => {
    //   if (product) {
    //     if (oldIndex) {
    //       this.cart[+oldIndex].orderB = product.orderB;
    //       this.cart[+oldIndex].orderP = product.orderP;
    //       this.cart[+oldIndex].promotionTo = product.promotionTo;
    //       this.cart[+oldIndex].discountPercent = product.discountPercent;
    //       this.cart[+oldIndex].discountAmount = product.discountAmount;
    //     } else {
    //       this.cart.push(product);
    //     }
    //   }
    // });
    // createPromotion.present();

    let createPromotion = this.modalCtrl.create('CreatePromotionModalPage', { product: product, appParam: this.appParam });
    createPromotion.onDidDismiss((product) => {
      if (product) {
        // this.cart.push(product);
        this.presentAlert(product);
      }
    });
    createPromotion.present();
  }

}
