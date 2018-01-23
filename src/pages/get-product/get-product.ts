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
  selector: 'page-get-product',
  templateUrl: 'get-product.html',
})
export class GetProductPage {
  appParam: any;
  stock: string = 'sr';
  warehouseCode: string = "";
  searchText: string = "";

  stockList: any[];
  stockSR: any[];
  stockVan: any[];

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private storage: Storage,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private vansalesProvider: VansalesProvider
  ) {
    this.stockSR = [];
    this.stockVan = [];
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
        this.vansalesProvider.getWarehouse(this.appParam.salesman.usercode).subscribe(res => {
          this.stockList = res;
          this.warehouseCode = this.stockList[0].storeid;
        });
      });
    });
  }

  // can search by productCode and productName
  // getStock api search stockSR
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
        .subscribe((stockSR) => {
          console.log('api stockSR', stockSR);
          this.stockSR = stockSR;
        }, (err) => {
          console.warn('error', err);
          loader.dismiss();
        }, () => {
          loader.dismiss();
        });
    } else {
      this.stockSR = [];
    }
  }

  addToVan(stockSR) {
    // new object with value js object always reference parent
    let product: any = JSON.parse(JSON.stringify(stockSR));
    let oldProductCode: string = "";
    this.stockVan.forEach(productInStockVan => {
      if (product.productCode === productInStockVan.productCode) {
        oldProductCode = productInStockVan.productCode;
        product.orderB = productInStockVan.qtyB;
        product.orderP = productInStockVan.qtyP;
      }
    });
    let orderModal = this.modalCtrl.create('OrderProductPage', { product: product, appParam: this.appParam });
    orderModal.present();
    orderModal.onDidDismiss((product) => {
      // if product exist in stockVan
      if (product != null) {
        this.stockVan.forEach(productInStockVan => {
          if (product.productCode === productInStockVan.productCode) {
            productInStockVan.qtyB = product.orderB;
            productInStockVan.qtyP = product.orderP;
          }
        });
        // if new product
        if (!oldProductCode) {
          product.qtyB = product.orderB;
          product.qtyP = product.orderP;
          product.orderB = 0;
          product.orderP = 0;
          this.stockVan.push(product);
        }
      }
    });
  }

  removeFromVan(productIndex) {
    this.stockVan.splice(productIndex, 1);
  }

  checkGetProudct() {
    if (this.stockVan.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'ยืนยันการเบิกสินค้า',
      message: 'ยืนยันการเบิกสินค้า?',
      buttons: [
        {
          text: 'ย้อนกลับ',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'ยืนยัน',
          handler: () => {
            console.log('Confirm clicked');
            this.confirmGetProduct();
          }
        }
      ]
    });
    alert.present();
  }

  confirmGetProduct() {
    // TODO gen running number for DocNo

    // api cut stock
    let criteriaGet = {
      "txtWarehouseCode": this.warehouseCode,
      "txtProductCode": '',
      "txtQty": null,
      "txtDocumentNo": 'C461091801', // fix DocNo change later
      "txtTransBy": this.appParam.salesman.usercode,
      "docType": '51'
    };
    for (let product of this.stockVan) {
      criteriaGet.txtProductCode = product.productCode;
      criteriaGet.txtQty = (product.qtyB * product.packingSize) + product.qtyP;
      // console.log('criteria', criteriaGet);
      this.vansalesProvider.getProductFromStock(criteriaGet).subscribe(res => {
        console.log('resGet', res);
      });
    }

    // api put stock
    let criteriaPut = {
      "txtWarehouseCode": this.appParam.salesman.usercode,
      "txtProductCode": '',
      "txtQty": null,
      "txtDocumentNo": 'C461091801', // fix DocNo change later
      "txtTransBy": this.appParam.salesman.usercode,
      "docType": '51'
    };
    for (let product of this.stockVan) {
      criteriaPut.txtProductCode = product.productCode;
      criteriaPut.txtQty = (product.qtyB * product.packingSize) + product.qtyP;
      // console.log('criteria', criteriaPut);
      this.vansalesProvider.putProductToStock(criteriaPut).subscribe(res => {
        console.log('resPut', res);
      });
    }

    this.navCtrl.pop();

  }

}
