import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import { HelperProvider } from '../helper/helper';
import { ProductModel } from '../../models/product';

@Injectable()
export class VansalesProvider {
	private url: string = 'http://uateservice.sahapat.com/';

	constructor(
		private http: Http,
		private helperProvider: HelperProvider
	) {
		this.url = 'http://uateservice.sahapat.com/'; // dev
		// this.url = 'http://uateservice.sahapat.com/'; // prod
	}

	// sales
	getTripSales(criteria: any) {
		let day = this.helperProvider.getDate();
		let param = {
			"salesmanCode": criteria.salesmanCode,
			"customerCode": criteria.customerCode,
			// "tripDay": criteria.tripDay // wait choose day feature
			"tripDay": day
			// "tripDay": '01'
		};
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return new Promise((resolve, reject) => {
			this.http.post(this.url + 'spcmaster/getSalesmanMaster', param, { headers: headers })
				.subscribe(res => {
					if (res.json().success) {
						// console.log('trip sales', res.json().results.tripCustomer);
						resolve(res.json().results);
					} else {
						resolve('criteria ไม่ถูกต้อง');
					}
				}, (err) => {
					reject(err);
				});
		});
	}

	getTargetSalesmanOrderHist(criteria: any): Observable<any> {
		let month = this.helperProvider.getMonth();
		let year = this.helperProvider.getYear();
		let request = {
			"salesmanCode": criteria.salesmanCode,
			"fromDate": "01/" + month + "/" + year,
			"toDate": ""
		};
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.post(this.url + 'spcmaster/getTargetSalesmanOrderHist', request, { headers: headers })
			.map(res => {
				if (res.json().success) {
					console.log('TargetAndHistory', res.json().results);
					return res.json().results;
				}
			});
	}

	getTripStatus(criteria: any): Observable<any> {
		let param = {
			"salesmancode": criteria.salesmancode,
			"tripno": criteria.tripno,
			"tripseq": criteria.tripseq,
			"customercode": criteria.customercode
		};
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.post(this.url + 'vansales/checktripstatus', param, { headers: headers })
			.map((res: any) => {
				if (res._body === "no") {
					// console.warn('no data');
					return 'no';
				} else {
					// console.log('Trip Status', res.json());
					// return res.json();
					return 'yes';
				}
			});
	}

	insertTripStatus(criteria: any): Observable<any> {
		let param = {
			"salesmancode": criteria.salesmancode,
			"tripno": criteria.tripno,
			"tripseq": criteria.tripseq,
			"customercode": criteria.customercode,
			"gpse": criteria.lat,
			"gpsn": criteria.lng,
			// status: 1 เปิดบิล 2 เก็บเงิน 3 เยี่ยม
			"status": 3,
			//  "status": criteria.any.status,
		};
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.post(this.url + 'vansales/insertcustomertripstatus', param, { headers: headers })
			.map(res => {
				if (res) {
					// console.log('Promotion List', res.json());
					return res.json();
				} else {
					console.warn('no data');
					return res.json();
				}
			});
	}
	// sales

	// product
	getStockVanMaster(criteria: any, option: string): Observable<any> {
		let param = {
			"salesmanCode": criteria.salesmanCode,
			"productCode": criteria.productCode
		};
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.post(this.url + 'spcmaster/getStockVanMaster', param, { headers: headers })
			.map(res => {
				if (res.json().success) {
					// console.log('results.stockVan ', res.json().results.stockVan);
					let stockVan = res.json().results.stockVan;
					let arrayProduct: any[] = [];
					let mProducts: ProductModel;
					for (let product of stockVan) {
						mProducts = {
							'productCode': product.productcode,
							'assortedProductGroup': "",
							'productNameThai': product.productnamethai,
							'productNameEnglish': product.productnameenglish,
							'palmProductNamet': product.palmproductnamet,
							'warehouseCode': product.warehousecode,
							'balanceOnHand': +product.balanceonhand,
							'balanceForInvoice': +product.balanceforinvoice,
							'qtyB': +product.balanceforinvoice,
							'qtyP': 0,
							'packingSize': +product.packingsize,
							'unitPrice': +product.unitprice,
							'piecePrice': +(product.unitprice / product.packingsize),
							'barcode': product.barcode,
							// init value
							'productInCart': false,
							'orderB': 0,
							'orderP': 0,
							'outOfStockB': false,
							'outOfStockP': false,
							'canBreak': true,
							'sumPrice': 0,
							'discount': 0,
							'totalPrice': 0,
							'premiumProduct': {
								'premiumProductCode': '',
								'premiumProductName': '',
								'premiumProductPackingSize': 0,
								'premiumProductQty': 0,
								'premiumProductUnit': ''
							}
						}
						arrayProduct.push(mProducts);
					}
					// select only have balanceOnHand 
					if (option = 'onHand') {
						arrayProduct = arrayProduct.filter((item) => {
							let balanceB = Math.floor(item.balanceForInvoice / item.packingSize);
							let balanceP = item.balanceForInvoice % item.packingSize;
							// console.log('itemCode', item.productCode, 'balanceB', balanceB, 'balanceP', balanceP);
							item.qtyB = balanceB;
							item.qtyP = balanceP;

							return item.balanceOnHand > 0 && item.unitPrice > 0;
						});
						// console.log('stockVan onHand', arrayProduct);
						return arrayProduct;
					} else if (option = 'all') {
						return arrayProduct;
					}
				}
			})
			.distinctUntilChanged();
	}

	checkPromotionC4(appParam: any): Observable<any> {
		/* let orderHead = {
			"salesmanCode": appParam.salesman.usercode,
			"divisionSale": appParam.salesman.divisioncode,
			"customerCode": "",
			"customerGroup": appParam.customer.customergroup,
			"sectionCode": appParam.salesman.sectioncode,
			"customerArea": appParam.customer.customerArea,
			"custSectionGrad": "",
			"orderDate": this.helperProvider.getDateMonthYear(),
		}; */
		let detail = {
			"productCode": "",
			"qty": "",
			"qtyp": "",
			"sectioncode": ""
		}
		let orderDetail: any[] = [];
		for (let order of appParam.cart) {
			detail = {
				"productCode": order.productCode,
				"qty": "" + order.orderB,
				"qtyp": "" + order.orderP,
				"sectioncode": appParam.salesman.sectioncode
			}
			orderDetail.push(detail);
		}
		let param = {
			"salesmanCode": appParam.salesman.usercode,
			"divisionSale": appParam.salesman.divisioncode,
			"customerCode": "",
			"customerGroup": appParam.customer.customergroup,
			"sectionCode": appParam.salesman.sectioncode,
			"customerArea": appParam.customer.customerArea,
			"custSectionGrad": "",
			"orderDate": this.helperProvider.getDateMonthYear(),
			"saleorderDtl": orderDetail
		};
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.post(this.url + 'spcmaster/checkPromotionC4', param, { headers: headers })
			.map(res => {
				if (res.json().success) {
					if (res.json().results.orderDtlpromotion) {
						// console.log('orderDtlpromotion', res.json().results.orderDtlpromotion);
						return res.json().results;
					}

				}
			});
	}

	getProductMasterCharacteristic(productCode: string, productSize: string) {
		let param = {
			"productcode": productCode,
			"productsize": productSize
		};
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.post(this.url + 'getProductMasterCharacteristic', param, { headers: headers })
			.map(res => {
				if (res.json().success) {
					// console.log('res.results', res.json().results);
					return res.json().results;
				}
			})
	}

	// เช็คของ
	checkStock(criteria: any): Observable<any> {
		let param = {
			"txtWarehouseCode": criteria.txtWarehouseCode,
			"txtProductCode": criteria.txtProductCode,
			"txtQty": criteria.txtQty,
			"txtDocumentNo": "",
			"txtTransBy": ""
		};
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.post(this.url + 'Stock/SearchCenterStockProductBalance', param, { headers: headers })
			.map(res => {
				if (res.json().Result === 'Y') {
					return 'Y';
				} else if (res.json().Result === 'N') {
					console.warn('warning', res.json().QtyBalance + '<' + criteria.txtQty);
					return 'N';
				}
			});
	}
	// จองของ
	reserveStock(criteria: any): Observable<any> {
		let param = {
			"txtWarehouseCode": criteria.txtWarehouseCode,
			"txtProductCode": criteria.txtProductCode,
			"txtQty": criteria.txtQty,
			// TODO add more parameter
			"txtDocumentNo": "",
			"txtTransBy": ""
		};
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.post(this.url + 'Stock/ReserveCenterStockProductBalance', param, { headers: headers })
			.map(res => {
				if (res.json().Result === 'Success') {
					return true;
				} else if (res.json().Result === 'Fail') {
					console.warn('warning', res.json().Msg);
					return false;
				}
			});
	}
	// ยกเลิก
	cancelReserveStock(criteria: any): Observable<any> {
		let param = {
			"txtWarehouseCode": criteria.txtWarehouseCode,
			"txtProductCode": criteria.txtProductCode,
			"txtQty": criteria.txtQty,
			// TODO add more parameter
			"txtDocumentNo": "",
			"txtTransBy": "C461"
		};
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.post(this.url + 'Stock/CancelReserveCenterStockProductBalance', param, { headers: headers })
			.map(res => {
				if (res.json().Result === 'Success') {
					return 'Y';
				} else if (res.json().Result === 'N') {
					console.warn('warning', res.json().Msg);
					return 'N';
				}
			});
	}
	// ตัดสต๊อก
	cutStock(criteria: any): Observable<any> {
		let param = {
			"txtWarehouseCode": criteria.txtWarehouseCode,
			"txtProductCode": criteria.txtProductCode,
			"txtQty": criteria.txtQty,
			// TODO add more parameter
			"txtDocumentNo": "",
			"txtTransBy": "C461"
		};
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.post(this.url + 'Stock/CutProductStockBalance', param, { headers: headers })
			.map(res => {
				if (res.json().Result === 'Success') {
					return 'Y';
				} else if (res.json().Result === 'N') {
					console.warn('warning', res.json().Msg);
					return 'N';
				}
			});
	}

	// refrac me plz
	reGroupProductAndPremiumProduct(cart, promotion) {
		let product: any = {
			"txtWarehouseCode": "",
			"txtProductCode": "",
			"txtQty": 0,
		};
		let productList: any[] = [];
		// for loop promotion
		for (let i = 0; i < promotion.length; i++) {
			product = {
				"txtWarehouseCode": cart[0].warehouseCode,
				"txtProductCode": promotion[i].productCode,
				"txtQty": +(promotion[i].qty * promotion[i].packingsize) + (+promotion[i].qtyp)
			}
			productList.push(product);

			// test if number is string can save?
			// test
			// promotion[i].discountCalcAmount += '';
			promotion[i].discountcalcamount = promotion[i].discountCalcAmount;
			// promotion[i].discountamount += '';
			// promotion[i].discountpercentamount += '';
			// promotion[i].discountspecialprice += '';

			promotion[i].remark = '';
			// test

			// TODO loop cart  map promotion to cart 
			// check if haveDiscount
			for (let j = 0; j < cart.length; j++) {

				if (promotion[i].productCode === cart[j].productCode) {
					if (+promotion[i].discountCalcAmount > 0) {// มีส่วนลด
						cart[j].discount = (+promotion[i].discountCalcAmount);
					} else {
						cart[j].discount = 0;
					}
					if (+promotion[i].discountspecialprice > 0) {// มีราคาพิเศษ
						cart[j].unitPrice = (+promotion[i].discountspecialprice);
					}

					cart[j].assortedProductGroup = promotion[i].assortedproductgroup;
					cart[j].sumPrice = (cart[j].orderB * cart[j].unitPrice) + (cart[j].orderP * (cart[j].unitPrice / cart[j].packingSize));
					cart[j].totalPrice = cart[j].sumPrice - cart[j].discount;

				}
			}
			// check if havePromotion
			if (!this.helperProvider.isEmpty(promotion[i].premiumproduct)) {
				this.getProductMasterCharacteristic(promotion[i].premiumproduct, promotion[i].premiumunit) // promotion[i].premiumquantity, promotion[i].premiumunit
					.subscribe(res => {
						if (res) {
							// console.log('res', res);
							promotion[i].premiumproductname = res[0].palmproductnamet;
							let productListIndex: number;

							for (let j = 0; j < cart.length; j++) {
								if (promotion[i].productCode === cart[j].productCode) {
									cart[j].premiumProduct.premiumProductCode = promotion[i].premiumproduct;
									cart[j].premiumProduct.premiumProductName = promotion[i].premiumproductname;
									cart[j].premiumProduct.premiumProductPackingSize = (+res[0].cfm_product_characteristic[0].packingsize);
									if (promotion[i].premiumunit === 'B') {
										cart[j].premiumProduct.premiumProductQty = (+res[0].cfm_product_characteristic[0].packingsize) * (+promotion[i].freepremiumquantity);
									} else if (promotion[i].premiumunit === 'P') {
										cart[j].premiumProduct.premiumProductQty = (+promotion[i].freepremiumquantity);
									}
									cart[j].premiumProduct.premiumProductUnit = promotion[i].premiumunit;

								}
							}

							// loop productList gen list for check stock
							for (let k = 0; k < productList.length; k++) {
								if (productList[k].txtProductCode === promotion[i].premiumproduct) {
									productListIndex = k;
									break;
								}
							}
							if (promotion[i].premiumunit === 'B') {
								// console.log('premiumunit === B');
								if (productListIndex) {
									// มี เพิ่มจำนวนถ้ามี
									productList[productListIndex].txtQty += (+res[0].cfm_product_characteristic[0].packingsize) * (+promotion[i].freepremiumquantity);
								} else {
									// ไม่มี สร้างใหม่
									product = {
										// warehouseCode ตอนนี้ 12/07/2017 สินค้ามี warehouseCode เหมือนกันหมด
										"txtWarehouseCode": cart[0].warehouseCode,// warehouseCode อนาคตอาจจะต้องทำให้ผู้ใช้สามารถเลือก warehouse ได้ ทำให้สินค้าอาจจะ warehouse ไม่เหมือนกัน
										"txtProductCode": promotion[i].premiumproduct,
										"txtQty": (+res[0].cfm_product_characteristic[0].packingsize) * (+promotion[i].freepremiumquantity)
									}
									productList.push(product);
								}
							} else if (promotion[i].premiumunit === 'P') {
								// console.log('premiumunit === P');
								if (productListIndex) {
									// มี เพิ่มจำนวนถ้ามี
									productList[productListIndex].txtQty += (+promotion[i].freepremiumquantity);
								} else {
									// ไม่มี สร้างใหม่
									product = {
										// warehouseCode ตอนนี้ 12/07/2017 สินค้ามี warehouseCode เหมือนกันหมด
										"txtWarehouseCode": cart[0].warehouseCode,// warehouseCode อนาคตอาจจะต้องทำให้ผู้ใช้สามารถเลือก warehouse ได้ ทำให้สินค้าอาจจะ warehouse ไม่เหมือนกัน
										"txtProductCode": promotion[i].premiumproduct,
										"txtQty": +promotion[i].freepremiumquantity
									}
									productList.push(product);
								}
							}
							// reproduce 409011, 499236, 411140
							// ทำงานไม่ถูกต้อง 
							// else {
							//   if (productListIndex) {
							//     // มี เพิ่มจำนวนถ้ามี
							//     productList[productListIndex].txtQty += (+promotion[i].freepremiumquantity);
							//   }
							// }

						} else {
							alert('สงสัย Internet จะมีปัญหา');
							return null;
						}
					});
			} else {

				// test
				// must delete 

				// promotion[i].premiumproduct = '';
				// promotion[i].premiumunit = '0';
				// promotion[i].premiumunit = '9';

				// test
				for (let j = 0; j < cart.length; j++) {
					if (promotion[i].productCode === cart[j].productCode) {
						cart[j].premiumProduct.premiumProductCode = '';
						cart[j].premiumProduct.premiumProductName = '';
						cart[j].premiumProduct.premiumProductPackingSize = 0;
						cart[j].premiumProduct.premiumProductQty = 0;
						cart[j].premiumProduct.premiumProductUnit = '';
					}
				}
			}

		}
		return productList;
	}
	// refrac me plz

	// product

	// promotion
	getPromotionMasterALL(appParam, productCode): Observable<any> {
		let promotionType: string = '';
		let salesCash: string = 'C';
		let salesCredit: string = 'S';
		let salesLeader: string = 'SL';
		if (appParam.salesman.usercode.indexOf(salesCash) !== -1) {
			promotionType = 'CC';
		} else if (appParam.salesman.usercode.indexOf(salesCredit) !== -1) {
			promotionType = 'CR';
		} else {
			promotionType = 'C5';
		}
		let param = {
			"divisionSale": appParam.salesman.divisioncode,
			"promotionType": promotionType,
			"customerArea": appParam.customer.customerArea,
			"productCode": productCode
		};
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.post(this.url + 'spcmaster/getPromotionMasterALL', param, { headers: headers })
			.map(res => {
				if (res.json().success) {
					// console.log('promotionList', res.json().results);
					return res.json().results;
				}
			});
	}
	// promotion
}
