import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CordovaGoogleMapProvider } from '../../providers/cordova-google-map/cordova-google-map';
import { NavigatorService } from '../../providers/navigator-service';

import { SalesProvider } from '../../providers/sales/sales';
import { ProductProvider } from '../../providers/product/product';
import { HelperProvider } from '../../providers/helper/helper';

@IonicPage()
@Component({
  selector: 'page-customer-info',
  templateUrl: 'customer-info.html',
})
export class CustomerInfoPage {
  appParam: any;
  customer: any;
  salesOrders: any;
  salesInvoices: any;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private cordovaGoogleMapProvider: CordovaGoogleMapProvider,
    private navi: NavigatorService,
    private salesProvider: SalesProvider,
    private productProvider: ProductProvider,
    private helperProvider: HelperProvider,
  ) {
    this.appParam = navParams.get('appParam');
    console.log('this.appParam', this.appParam);

    this.customer = this.appParam.customer;
    if (this.customer.gpsn && this.customer.gpse) {
      if (typeof (this.customer.gpsn) === 'number' && typeof (this.customer.gpse) === 'number') {
        // do nothing
      } else {
        this.customer.gpsn = this.helperProvider.convertStringLatLngToDouble(this.customer.gpsn);
        this.customer.gpse = this.helperProvider.convertStringLatLngToDouble(this.customer.gpse);
      }
    } else {
      this.customer.gpsn = "ไม่มีพิกัด";
      this.customer.gpse = "ไม่มีพิกัด";
    }
    console.log('this.customer', this.customer);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerInfoPage');
    this.productProvider.searchSalesOrderHead(this.appParam)
      .subscribe((res) => {
        console.log('sales order history', res);
        this.salesOrders = res;
      }, (err) => {
        console.warn('error', err);
      }, () => {
        console.log('finish');
      })
  }

  tripOn() {
    let tripNo = this.getTripNo(this.customer);
    let tripSeq = this.getTripSeq(this.customer);

    this.cordovaGoogleMapProvider.geo.getCurrentPosition().then((resp) => {
      if (resp) {
        let criteria = {
          "salesmancode": this.appParam.salesman.usercode,
          "tripno": tripNo,
          "tripseq": tripSeq,
          "customercode": this.customer.customerCode,
          "lat": resp.coords.latitude,
          "lng": resp.coords.longitude,
          "status": 3 // 1 เปิดบิล 2 เก็บเงิน 3 เยี่ยม
        }
        this.salesProvider.insertTripStatus(criteria).subscribe(res => {
          console.log('return response form insert', res);
        });
      } else {
        let criteria = {
          "salesmancode": this.appParam.salesman.usercode,
          "tripno": tripNo,
          "tripseq": tripSeq,
          "customercode": this.customer.customerCode,
          "lat": 0,
          "lng": 0,
          "status": 3 // 1 เปิดบิล 2 เก็บเงิน 3 เยี่ยม
        }
        this.salesProvider.insertTripStatus(criteria).subscribe(res => {
          console.log('return response form insert', res);
        });
      }
    }).catch((error) => {
      console.warn('Error getting location', error);
    });;

  }

  getTripNo(customer) {
    if (customer.dateTrip1) {
      return customer.dateTrip1;
    } else if (customer.dateTrip2) {
      return customer.dateTrip2;
    } else if (customer.dateTrip3) {
      return customer.dateTrip3;
    } else if (customer.dateTrip4) {
      return customer.dateTrip4;
    } else {
      console.warn('why no tripNo!?');
      return '0';
    }
  }

  getTripSeq(customer) {
    if (customer.tripSeq1) {
      return customer.tripSeq1;
    } else if (customer.tripSeq2) {
      return customer.tripSeq2;
    } else if (customer.tripSeq3) {
      return customer.tripSeq3;
    } else if (customer.tripSeq4) {
      return customer.tripSeq4;
    } else {
      console.warn('why no tripSeq!?');
      return '0';
    }
  }

  navigateToCustomer() {
    let destination: number[] | string = [];
    let start: number[] = [];
    let geoOption = {
      maximumAge: 0,
      enableHighAccuracy: true
    }
    this.cordovaGoogleMapProvider.geo.getCurrentPosition(geoOption)
      .then((resp) => {
        start = [resp.coords.latitude, resp.coords.longitude];
        let address: string = this.customer.address + ' ' + this.customer.districtThai + ' ' + this.customer.amphurThai + ' ' + this.customer.provinceThai;

        if (this.customer.gpsn && this.customer.gpse) {
          destination = [this.customer.gpsn, this.customer.gpse];
        } else if (address) {
          destination = address;
        }

        this.navi.startNavigation(destination, start);
      })
      .catch((err) => {
        console.log('Error getting location', err);
        alert('โปรดเปิด gps');
      });
  }

  goToChooseProduct() {
    this.navCtrl.push('ChooseProductPage', { 'appParam': this.appParam });
  }

  goToPromotionListPage() {
    this.navCtrl.push('PromotionsListPage', { 'appParam': this.appParam });
  }

}
