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
  selector: 'page-return-product',
  templateUrl: 'return-product.html',
})
export class ReturnProductPage {
  appParam: any;
  stock: string = 'van';
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
    this.stockVan = [];
    this.stockSR = [];
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
        // console.log('user', this.appParam);
        this.vansalesProvider.getWarehouse(this.appParam.salesman.usercode).subscribe(res => {
          this.stockList = res;
          this.warehouseCode = this.stockList[0].storeid;
        });
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
        "salesmanCode": this.appParam.salesman.usercode,
        "productCode": searchText.trim(),
      }
      let option: string = 'onHand';
      this.vansalesProvider.getStockVanMaster(criteria, option)
        .subscribe((stockVan) => {
          this.stockVan = stockVan;
        }, (err) => {
          console.warn('error', err);
          loader.dismiss();
        }, () => {
          loader.dismiss();
        });
    } else {
      this.stockVan = [];
    }
  }

  putToStock(stockVan) {
    // new object with value js object always reference parent
    let product: any = JSON.parse(JSON.stringify(stockVan));
    let oldProductCode: string = "";
    this.stockSR.forEach(productInStockSR => {
      if (product.productCode === productInStockSR.productCode) {
        oldProductCode = productInStockSR.productCode;
        product.orderB = productInStockSR.qtyB;
        product.orderP = productInStockSR.qtyP;
      }
    });
    let orderModal = this.modalCtrl.create('OrderProductPage', { product: product, appParam: this.appParam });
    orderModal.present();
    orderModal.onDidDismiss((product) => {
      if (product != null) {
        this.stockSR.forEach(productInStockSR => {
          if (product.productCode === productInStockSR.productCode) {
            productInStockSR.qtyB = product.orderB;
            productInStockSR.qtyP = product.orderP;
          }
        });
        if (!oldProductCode) {
          product.qtyB = product.orderB;
          product.qtyP = product.orderP;
          product.orderB = 0;
          product.orderP = 0;
          this.stockSR.push(product);
        }
      }
    });
  }

  removeFromSR(productIndex) {
    this.stockSR.splice(productIndex, 1);
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'ยืนยันคืนสินค้า',
      message: 'ยืนยันคืนสินค้า?',
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
            this.confirmPutProductToStock();
          }
        }
      ]
    });
    alert.present();
  }

  checkPutProudct() {
    if (this.stockSR.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  confirmPutProductToStock() {
    // TODO gen running number for DocNo

    // api cut stock
    let criteriaGet = {
      "txtWarehouseCode": this.appParam.salesman.usercode,
      "txtProductCode": '',
      "txtQty": null,
      "txtDocumentNo": 'C461091801', // fix DocNo change later
      "txtTransBy": this.appParam.salesman.usercode,
      "docType": '52'
    };
    for (let product of this.stockSR) {
      criteriaGet.txtProductCode = product.productCode;
      criteriaGet.txtQty = (product.qtyB * product.packingSize) + product.qtyP;
      // console.log('criteria', criteriaGet);
      this.vansalesProvider.getProductFromStock(criteriaGet).subscribe(res => {
        console.log('resGet', res);
      });
    }

    // api put stock
    let criteriaPut = {
      "txtWarehouseCode": this.warehouseCode,
      "txtProductCode": '',
      "txtQty": null,
      "txtDocumentNo": 'C461091801', // fix DocNo change later
      "txtTransBy": this.appParam.salesman.usercode,
      "docType": '52'
    };
    for (let product of this.stockSR) {
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
