import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { LoadingProvider } from '../../providers/loading/loading';
import { StorageProvider } from '../../providers/storage/storage';
import { ProductProvider } from '../../providers/product/product'

@IonicPage()
@Component({
  selector: 'page-sell-product',
  templateUrl: 'sell-product.html',
})
export class SellProductPage {
  user: any;
  customer: any;
  cart: any;
  total: number;
  discount: number;
  net: number;
  rewards: any;
  rewardText: any = [];
  disablePaymentBtn: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingProvider: LoadingProvider,
    private storageProvider: StorageProvider,
    private platform: Platform,
    private productProvider: ProductProvider
  ) {

  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {

      this.disablePaymentBtn = true;

      this.storageProvider.load('Cart').then((res: Object[]) => {
        this.cart = res;
        // console.log('get cart', this.cart);
      }).catch(err => console.log(err));

      this.storageProvider.load('AuthToken').then(res => {
        this.user = res;
        // console.log('get user', this.user);
      }).catch(err => console.log('error', err));

      this.storageProvider.load('Customer').then(res => {
        this.customer = res[0]
        // console.log('get customer', this.customer);
      }).catch(err => console.log('error', err));
    });
  }

  validateOrder(product) {
    let cart = this.cart;
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].order_package === 0 && cart[i].order_piece === 0) {
        this.disablePaymentBtn = true;
        break;
      } else if (cart[i].order_package > cart[i].qty_package || cart[i].order_piece > cart[i].order_piece) {
        this.disablePaymentBtn = true;
        break;
      }
      else {
        product.total_price = ((product.order_package * product.qty_per_package) * product.price_per_piece) + (product.order_piece * product.price_per_piece);
        this.disablePaymentBtn = false;
      }
    }
  }

  // validateStock(product) {
  //   // validate pack
  //   if (product.order_package > product.qty_package) {
  //     product.out_of_stock_package = true;
  //     this.disablePaymentBtn = true;
  //   } else {
  //     product.out_of_stock_package = false;
  //     this.disablePaymentBtn = false;
  //   }
  //   // validate piece
  //   if (product.order_piece > (product.qty_package * product.qty_per_package) + product.qty_piece) {
  //     product.out_of_stock_piece = true;
  //     this.disablePaymentBtn = true;
  //   } else {
  //     product.out_of_stock_piece = false;
  //     this.disablePaymentBtn = false;
  //   }
  //   // console.log('product', product);
  // }

  validatePackage(product) {
    // validate pack
    product.order_package = Number(product.order_package);
    if (product.order_package > product.qty_package) {
      product.out_of_stock_package = true;
      this.disablePaymentBtn = true;
    } else {
      product.out_of_stock_package = false;
    }
  }

  validatePiece(product) {
    // validate piece
    product.order_piece = Number(product.order_piece);
    if (product.order_piece > (product.qty_package * product.qty_per_package) + product.qty_piece) {
      product.out_of_stock_piece = true;
      this.disablePaymentBtn = true;
    } else {
      product.out_of_stock_piece = false;
    }
  }

  calculateC4() {
    let content = 'กำลังคิดโปรโมชัน...';
    let loader = this.loadingProvider.showLoading(content);

    let orderHead = {
      "salesmanCode": this.user.usercode,
      "divisionSale": this.user.divisioncode,
      "customerCode": "",
      "customerGroup": this.customer.customergroup,
      "customerArea": this.customer.customerArea,
      "custSectionGrad": "",
      "orderDate": "28/02/2017", // todo change to device current date
    };
    let detail = {
      "productCode": "",
      "qty": "",
      "qtyp": "",
    }
    let orderDetail = [];
    for (let order of this.cart) {
      detail = {
        "productCode": order.product_id,
        "qty": "" + order.order_package,
        "qtyp": "" + order.order_piece,
      }
      orderDetail.push(detail);
    }
    let criteria = {
      "salesmanCode": orderHead.salesmanCode,
      "divisionSale": orderHead.divisionSale,
      "customerCode": orderHead.customerCode,
      "customerGroup": orderHead.customerGroup,
      "customerArea": orderHead.customerArea,
      "custSectionGrad": orderHead.custSectionGrad,
      "orderDate": orderHead.orderDate,
      "saleorderDtl": orderDetail
    };

    console.log("criteria", criteria);
    this.productProvider.calculateC4(criteria)
      .then((resolve) => {
        console.log('promotions', resolve);
        this.rewardText = [];
        this.rewards = resolve;
        for (let reward of this.rewards) {
          if (reward.calcpromotion) {
            if (reward.calcpromotion.discountCalcAmount) {
              let text: string = reward.productCode + 'ได้รับส่วนลด ' + reward.calcpromotion.discountCalcAmount + ' บาท';
              this.rewardText.push(text);
              // console.log(reward.productCode + 'ได้รับส่วนลด ' + reward.calcpromotion.discountCalcAmount + ' บาท');
            } else if (reward.calcpromotion.freepremiumquantity) {
              let text: string = 'แถม ' + reward.calcpromotion.premiumproduct + ' ฟรี ' + reward.calcpromotion.freepremiumquantity + ' ชิ้น';
              this.rewardText.push(text);
              // console.log('แถม ' + reward.calcpromotion.premiumproduct + ' ฟรี ' + reward.calcpromotion.freepremiumquantity + ' ชิ้น');
            }
          }

          if (this.rewardText) loader.dismiss();
        }
      }).catch((reject) => {
        console.warn('error', reject);
        loader.dismiss();
      });
  }

  removeFormCart(product) {
    let tempCart = [];
    this.cart = this.cart.filter(cart => {
      if (cart.product_id !== product.product_id) {
        tempCart.push(cart);
        return cart;
      }
    });
    this.storageProvider.save('Cart', tempCart).then(() => {
      console.log('cart', tempCart);
    });
  }

}
