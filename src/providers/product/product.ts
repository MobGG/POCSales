import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { HelperProvider } from '../helper/helper';
import { ProductModel } from '../../models/product';

@Injectable()
export class ProductProvider {
  url: string = '';
  constructor(
    private http: Http,
    private helper: HelperProvider,
  ) {
    console.log('Hello ProductProvider Provider');
    this.url = 'http://uateservice.sahapat.com/';
  }

  getStockVanMaster(criteria: any, option: string): Observable<any> {
    let param = {
      "salesmanCode": criteria.salesmanCode,
      "productCode": criteria.productCode
    };
    return this.http.post(this.url + 'spcmaster/getStockVanMaster', param)
      .timeout(5000)
      .map(res => {
        if (res.json().success) {
          // console.log('results.stockVan ', res.json().results.stockVan);
          let stockVan = res.json().results.stockVan;
          let arrayProduct: ProductModel[] = [];
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
              'discountPercent': 0,
							'discountAmount': 0,
							'specialPrice': 0,
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
      });
  }

  checkPromotionC4(appParam: any): Observable<any> {
    let orderHead = {
      "salesmanCode": appParam.salesman.usercode,
      "divisionSale": appParam.salesman.divisioncode,
      "customerCode": "",
      "customerGroup": appParam.customer.customergroup,
      "sectionCode": appParam.salesman.sectioncode,
      "customerArea": appParam.customer.customerArea,
      "custSectionGrad": "",
      // "orderDate": "01/06/2017", // todo change to device current date
      "orderDate": this.helper.getDateMonthYear(),
    };
    let detail = {
      "productCode": "",
      "qty": "",
      "qtyp": "",
      "sectioncode": ""
    }
    let orderDetail = [];
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
      "salesmanCode": orderHead.salesmanCode,
      "divisionSale": orderHead.divisionSale,
      "customerCode": orderHead.customerCode,
      "customerGroup": orderHead.customerGroup,
      "sectionCode": orderHead.sectionCode,
      "customerArea": orderHead.customerArea,
      "custSectionGrad": orderHead.custSectionGrad,
      "orderDate": orderHead.orderDate,
      "saleorderDtl": orderDetail
    };

    return this.http.post(this.url + 'spcmaster/checkPromotionC4', param)
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
    return this.http.post(this.url + 'getProductMasterCharacteristic', param)
      .map(res => {
        if (res.json().success) {
          // console.log('res.results', res.json().results);
          return res.json().results;
        }
      })
  }

  // checkStockProductBalance
  searchCenterStockProductBalance(criteria: any): Observable<any> {
    let param = {
      "txtWarehouseCode": criteria.txtWarehouseCode,
      "txtProductCode": criteria.txtProductCode,
      "txtQty": criteria.txtQty,
      "txtDocumentNo": "",
      "txtTransBy": ""
    };
    return this.http.post(this.url + 'Stock/SearchCenterStockProductBalance', param)
      .map(res => {
        if (res.json().Result === 'Y') {
          return 'Y';
        } else if (res.json().Result === 'N') {
          console.warn('warning', res.json().QtyBalance + '<' + criteria.txtQty);
          return 'N';
        }
      });
  }

  // checkStock promise style
  searchStock(criteria: any): Observable<any> {
    let param = {
      "txtWarehouseCode": criteria.txtWarehouseCode,
      "txtProductCode": criteria.txtProductCode,
      "txtQty": criteria.txtQty,
      "txtDocumentNo": "",
      "txtTransBy": ""
    };
    return this.http.post(this.url + 'Stock/SearchCenterStockProductBalance', param)
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
  reserveCenterStockProductBalance(criteria: any): Observable<any> {
    let param = {
      "txtWarehouseCode": criteria.txtWarehouseCode,
      "txtProductCode": criteria.txtProductCode,
      "txtQty": criteria.txtQty,
      // TODO add more parameter
      "txtDocumentNo": "",
      "txtTransBy": ""
    };
    return this.http.post(this.url + 'Stock/ReserveCenterStockProductBalance', param)
      .map(res => {
        if (res.json().Result === 'Success') {
          return true;
        } else if (res.json().Result === 'Fail') {
          console.warn('warning', res.json().Msg);
          return false;
        }
      });
  }
  // ยกเลิกการจอง
  cancelReserveCenterStockProductBalance(criteria: any): Observable<any> {
    let param = {
      "txtWarehouseCode": criteria.txtWarehouseCode,
      "txtProductCode": criteria.txtProductCode,
      "txtQty": criteria.txtQty,
      // TODO add more parameter
      "txtDocumentNo": "",
      "txtTransBy": "C461"
    };
    return this.http.post(this.url + 'Stock/CancelReserveCenterStockProductBalance', param)
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
  cutProductStockBalance(criteria: any): Observable<any> {
    let param = {
      "txtWarehouseCode": criteria.txtWarehouseCode,
      "txtProductCode": criteria.txtProductCode,
      "txtQty": criteria.txtQty,
      // TODO add more parameter
      "txtDocumentNo": "",
      "txtTransBy": "C461"
    };
    return this.http.post(this.url + 'Stock/CutProductStockBalance', param)
      .map(res => {
        if (res.json().Result === 'Success') {
          return 'Y';
        } else if (res.json().Result === 'N') {
          console.warn('warning', res.json().Msg);
          return 'N';
        }
      });
  }

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
      if (!this.helper.isEmpty(promotion[i].premiumproduct)) {
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

  saveb2bTSpcSoSaleOrder(appParam): Observable<any> {
    let params: any = {
      'salesmancode': appParam.salesman.usercode,
      'divisionsale': appParam.salesman.divisioncode,
      'customercode': appParam.customer.customerCode,
      // 'customercode': '0013835',
      'sodate': this.helper.getDateMonthYear(),
      // 'sodate': '15/03/2016',
      'discountamount': 0,// fix value for test
      // 'discountamount': sumDiscount,// TODO ไป sum discount ทุกอันมาใส่
      'totalamount': appParam.money.total,
      // 'totalamount': 9000,
      'nettotal': appParam.money.netTotal,
      // 'nettotal': 10000,
      'deliverydate': '20/07/2017',
      'pricetype': '01',// fix value for test
      // 'vatcode': '01',// fix value for test
      'taxcode': '01',// fix value for test
      'vatrate': appParam.money.vat, // fix value for test
      // 'vatrate': '7', // fix value for test
      'remark': 'test',
      'createby': appParam.salesman.usercode,


      'accountto': appParam.customer.customerCode,
      'deliveryto': appParam.customer.customerCode,
      'bancode': '',
      'maccode': '',
      'acccode': '',
      'warehousecode': appParam.stock[0].txtWarehouseCode,


      'saleorderDtl': appParam.promotion,
    };


    /* let fixParam = {
      'salesmancode': 'S044',
      'divisionsale': 'B',
      'customercode': '0013835',
      'sodate': '15/03/2016',
      'discountamount': '400',
      'totalamount': '1200',
      'nettotal': '1300',
      'deliverydate': '20/03/2016',
      'pricetype': '01',
      'vatcode': '01',
      'vatrate': '7',
      'remark': 'test',
      'createby': 'admin',
      'accountto': '0013835',
      'deliveryto': '0013835',
      'bancode': '',
      'maccode': '',
      'acccode': '',
      'warehousecode': 'S044',
      'saleorderDtl': [
        {
          'productCode': '409011',
          'qty': '20',
          'qtyp': '0',
          'sectioncode': '702',
          'assortedproductgroup': 'MMM',
          'unitprice': '890',
          'promotiontype': 'discountamount',
          'discountpercentamount': '0',
          'discountspecialprice': '0',
          'discountcalcamount': '1380',
          'premiumproduct': '',
          'premiumquantity': '4',
          'premiumunit': '0',
          'freepremiumquantity': '',
          'remark': 'test product 409011',
        }
      ]
    } */

    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    // console.log('params', params);
    // console.log('fixParam', fixParam);

    return this.http.post(this.url + 'spcprocess/saveb2bTSpcSoSaleOrder', params, { headers: headers })
      // return this.http.post(this.url + 'spcprocess/saveb2bTSpcSoSaleOrder', fixParam, { headers: headers })
      .map(res => {
        if (res.json().success) {
          console.log('sono', res.json().sono);
          return res.json().sono;
        }
      });
  }

  searchSalesOrderHead(appParam): Observable<any> {
    let params = {
      "salesmanCode": appParam.salesman.usercode,
      "customerCode": appParam.customer.customerCode,
      "soDate": ""
    }
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    // console.log('params', params);

    return this.http.post(this.url + 'spcprocess/searchSalesOrderHead', params, { headers: headers })
      .map(res => {
        if (res.json().success) {
          // console.log('results', res.json().results);
          return res.json().results;
        }
      });
  }

  getTodaySoldProducts(criteria): Observable<any> {
    let params = {
      "salesmanCode": criteria.salesmanCode,
    }
    console.log('params', params);
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.post(this.url + 'spcprocess/todaySoldProducts', params, { headers: headers })
      .map(res => {
        if (res.json().success) {
          // console.log('results', res.json().results);
          return res.json().results;
        }
      });
  };

}


