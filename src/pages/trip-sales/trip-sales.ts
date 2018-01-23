import { Component, ViewChild, ElementRef } from '@angular/core';
import { App, IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
// test splash screen
import { Storage } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoadingProvider } from '../../providers/loading/loading';
import { ConnectivityProvider } from '../../providers/connectivity/connectivity';
import { CordovaGoogleMapProvider } from '../../providers/cordova-google-map/cordova-google-map';
import { LocationTrackerProvider } from '../../providers/location-tracker/location-tracker';
import { SalesProvider } from '../../providers/sales/sales';
import { NavigatorService } from '../../providers/navigator-service';

@IonicPage()
@Component({
  selector: 'page-trip-sales',
  templateUrl: 'trip-sales.html',
})
export class TripSales {

  @ViewChild('map') mapElement: ElementRef;
  salesman: any;
  trips: any;
  markers: any;
  color: string = 'blue';

  constructor(
    public app: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private loadingProvider: LoadingProvider,
    private storage: Storage,
    private connectivityService: ConnectivityProvider,
    private cordovaGoogleMapProvider: CordovaGoogleMapProvider,
    private salesProvider: SalesProvider,
    private locationTracker: LocationTrackerProvider,
    private navi: NavigatorService,
  ) {
    console.log('trip sale page');
    this.locationTracker.trackSales();
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.splashScreen.hide();
      if (this.connectivityService.isOnline()) {
        // create loader
        let content = 'กำลังเตรียมทริปเซล...';
        let loader = this.loadingProvider.showLoading(content);

        let key: string = 'AuthToken';
        this.storage.ready().then(() => {
          this.storage.get(key).then(user => {
            this.salesman = user;
            let criteria = {
              "salesmanCode": user.usercode,
              "customerCode": "",
              "tripDay": ""
            }
            let maploaded = this.cordovaGoogleMapProvider.init(this.mapElement.nativeElement);
            let focusDevice = this.cordovaGoogleMapProvider.focusOnDevice();
            let tripsSales = this.salesProvider.getSalesmanMaster(criteria);
            Promise.all([
              maploaded,
              tripsSales,
              focusDevice
            ]).then((result) => {
              this.trips = result[1];
              console.log('trips', this.trips.tripCustomer);
              this.markers = this.cordovaGoogleMapProvider.convertTripsToMarker(this.trips.tripCustomer);
              this.cordovaGoogleMapProvider.loadMarker(this.markers);

              if (this.trips) {
                loader.dismiss();
              }

            }).catch((err) => {
              loader.dismiss();
              console.error('thrownOutError:', err);
            });
          });
        }).catch((err) => {
          console.error('storage error', err);
        });
      } else {
        alert('โปรดต่อเน็ต');
      }
    }).catch((err) => {
      console.error('platform error', err);
    })
  }

  testClickIcon(event) {
    event.stopPropagation();
    alert('Pin Click');
    console.log('asas');
  }

  goToMarker(event, marker: any) {
    event.stopPropagation();
    // console.log('u clicked goToMarker');
    this.cordovaGoogleMapProvider.goToMarker(marker, null);
  }

  startNavigator(event, marker: any) {
    event.stopPropagation();
    // console.log('u clicked startNavigator');
    let destination: number[] = [];
    let start: number[] = [];
    let geoOption = {
      maximumAge: 0,
      // timeout: 2000,
      enableHighAccuracy: true
    }
    this.cordovaGoogleMapProvider.geo.getCurrentPosition(geoOption)
      .then((resp) => {
        // console.log('response ', resp);
        start = [resp.coords.latitude, resp.coords.longitude];
        // console.log('marker ', marker);
        // if (marker.position.lat && marker.position.lng) {
        if (marker.customerPosition) {
          destination = [marker.customerPosition.lat, marker.customerPosition.lng];
          // console.log('destination LatLng >>> ' + destination);
        } else if (marker.snippet) {
          destination = marker.snippet;
          // console.log('destination string >>> ' + destination);
        }
        this.navi.startNavigation(destination, start);
        // console.log('start >>> ' + start);
      })
      .catch((err) => {
        console.log('Error getting location', err);
        // alert('โปรดเปิด gps');
      });
  }

  mapCustomerAndMarker(marker) {
    // console.log('selected customer ', marker);
    // console.log('trip customer ', this.trips.tripCustomer);
    let customer: any[];
    customer = this.trips.tripCustomer.filter((item) => {
      return item.customerCode + ' ' + item.customerNameThai === marker.customer; // ต่อ string กันไว้เทียบกับ object marker
    });
    if (customer[0]) {
      return customer[0];
    } else {
      console.warn('BUG');
    }
  }

  setupAppParam(salesman, customer) {
    let smartVanSalesParam: any = {
      'salesman': salesman,
      'customer': customer,
      'cart': {},
      'money': {},
      'paymentInfo': {}
    }
    return smartVanSalesParam;
  }

  goToCustomerInfo(event, marker) {
    event.stopPropagation();
    // app parameter
    let customer = this.mapCustomerAndMarker(marker);
    let appParam = this.setupAppParam(this.salesman, customer);
    this.navCtrl.push('CustomerInfoPage', { 'appParam': appParam });
  }

  goToChooseProduct(event, marker) {
    event.stopPropagation();
    // app parameter
    let customer = this.mapCustomerAndMarker(marker);
    let appParam = this.setupAppParam(this.salesman, customer);
    this.navCtrl.push('ChooseProductPage', { 'appParam': appParam });
  }

  goToPromotionListPage(event, marker) {
    event.stopPropagation();
    let customer = this.mapCustomerAndMarker(marker);
    let appParam = this.setupAppParam(this.salesman, customer);
    console.log('customer', customer);
    this.navCtrl.push('PromotionsListPage', { 'appParam': appParam });
  }

  logout() {
    let key: string = 'AuthToken';
    this.storage.remove(key).then(() => {
      this.app.getRootNav().setRoot('Login');
    })
  }

}
