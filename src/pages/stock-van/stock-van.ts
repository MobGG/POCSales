import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { LoadingProvider } from '../../providers/loading/loading'

import { VansalesProvider } from '../../providers/vansales/vansales'

@IonicPage()
@Component({
	selector: 'page-stock-van',
	templateUrl: 'stock-van.html',
})
export class StockVanPage {
	appParam: any;
	docNo: string = "";
	type: string = "";
	text: string = "";

	stock: string = 'sr';
	stockSR: any[];
	stockVan: any[];

	constructor(
		private navCtrl: NavController,
		private navParams: NavParams,
		private modalCtrl: ModalController,
		private storage: Storage,
		private loadingProvider: LoadingProvider,
		private vansalesProvider: VansalesProvider
	) {
		let key: string = 'AuthToken';
		this.storage.ready().then(() => {
			this.storage.get(key).then(user => {
				let param: any = {
					'salesman': user,
					'customer': {},
					'cart': {},
					'money': {},
					'paymentInfo': {}
				}
				this.appParam = param;
				console.log('user', this.appParam);
			});
		});

		this.docNo = this.navParams.get('docNo');
	}

	ionViewDidLoad() {
		this.stockSR = [];
		this.stockVan = [];
	}

	// can search by productCode and productName
	search() {
		let content = 'กำลังค้นหาสินค้า...';
		let text: string = this.text;
		if (typeof text === 'string' && text.trim() !== '') {
			let loader = this.loadingProvider.showLoading(content);
			let criteria = {
				"salesmanCode": 'C461',
				// "productCode": '221',
				// "salesmanCode": this.appParam.salesman.usercode,
				"productCode": text.trim(),
			}
			let option: string = 'onHand';
			this.vansalesProvider.getStockVanMaster(criteria, option)
				.subscribe((stockVan) => {
					// console.log('stockVan', stockVan);
					// console.log('count', stockVan.length);
					this.stockSR = stockVan;
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
		// this.stockVan.push(stockSR);
		let order: any = JSON.parse(JSON.stringify(stockSR));// new object with value js object always reference paraeent

		let oldProductCode: string = "";
		this.stockVan.forEach(productInCart => {
			if (order.productCode === productInCart.productCode) {
				oldProductCode = productInCart.productCode;
				order = JSON.parse(JSON.stringify(productInCart));
				// console.log('order', order);
			}
		});

		let orderModal = this.modalCtrl.create('OrderProductPage', { product: order, appParam: this.appParam });
		orderModal.present();
		orderModal.onDidDismiss((order) => {
			if (order != null) {
				this.stockVan.forEach(product => {
					if (order.productCode === product.productCode) {
						product.orderB = order.orderB;
						product.orderP = order.orderP;
					}
				});
				if (!oldProductCode) {
					this.stockVan.push(order);
				}
			}
		});
	}

	removeFromVan(productIndex) {
		this.stockVan.splice(productIndex, 1);
	}

	confirmStockVan() {
		// loop for manange stockVan data b4 save
		this.stockVan.forEach(product => {
			product.qtyB = product.orderB;
			product.qtyP = product.orderP;
			product.orderB = 0;
			product.orderP = 0;
		});

		let key: string = 'StockVanSales';
		let value: any = this.stockVan;
		this.storage.set(key, value).then(() => {
			console.log('pop plz');
			this.navCtrl.pop();
		});
	}

}
