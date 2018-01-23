import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';

@Injectable()
export class LocationTrackerProvider {
  public salesman: any;
  public lat: number = 0;
  public lng: number = 0;

  constructor(
    private http: Http,
    public bgGeo: BackgroundGeolocation,
    private platform: Platform,
    private storage: Storage,

  ) {
    console.log('Hello LocationTrackerProvider Provider');

  }

  trackSales() {
    // console.log('platform', this.platform.platforms());

    /* 
    Platform Name	Description
    android	on a device running Android.
    cordova	on a device running Cordova.
    core	on a desktop device.
    ios	on a device running iOS.
    ipad	on an iPad device.
    iphone	on an iPhone device.
    mobile	on a mobile device.
    mobileweb	in a browser on a mobile device.
    phablet	on a phablet device.
    tablet	on a tablet device.
    windows	on a device running Windows.
    */
    let key: string = 'AuthToken';
    this.platform.ready().then(() => {
      this.storage.get(key).then(user => {
        this.salesman = user;
        if (this.platform.is('cordova')) {
          this.bgGeo.isLocationEnabled().then((res: number) => {
            // res values 0, 1 (true)
            if (res) {
              this.startTracking();
            } else {
              alert('ไม่ได้เปิด GPS');
            }
          });
        }
      });
    });
  }

  startTracking() {
    console.log('Start Tracking');
    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 0,
      stationaryRadius: 20,
      distanceFilter: 30,
      maxLocations: 10000, //default

      debug: true, //  enable this hear sounds for background-geolocation life-cycle.
      // background HTTP locations posting
      httpHeaders: { 'salesId': this.salesman.usercode },
      url: 'http://uateservice.sahapat.com/saveTrackingData', // uat
      syncUrl: 'http://uateservice.sahapat.com/saveSyncFailTrackingData', // uat
      // url: 'http://uateservice.sahapat.com/saveTrackingData', // production
      // syncUrl: 'http://uateservice.sahapat.com/saveSyncFailTrackingData', // production
      syncThreshold: 5,
      // background HTTP locations posting

      // android only section
      locationProvider: 0,
      interval: 60000,
      fastestInterval: 1000, // test ผ่านมาแก้เป็น 60000 ด้วย
      // activitiesInterval: 10000,
      notificationTitle: 'TripSales Tracking',
      notificationText: 'Enabled',
      notificationIconColor: '#FEDD1E',
      notificationIconLarge: 'mappointer_large',
      // notificationIconSmall: 'mappointer_small',
      startOnBoot: true, // android only
      stopOnTerminate: false, // enable this to clear background location settings when the app terminates
    };

    this.bgGeo.configure(config)
      .subscribe((location: BackgroundGeolocationResponse) => {
        console.log('location', location);
        // console.log('bgGeo >>> ' + this.laSt + ', ' + this.lng);

        // Run update inside of Angular's zone
        // this.zone.run(() => {
        //   this.lat = location.latitude;
        //   this.lng = location.longitude;
        // console.dir(location);
        // });

        this.bgGeo.finish();
      }, (err) => {
        console.log(err);
      });
    // start recording location
    this.bgGeo.start();
  }

  stopTracking() {
    console.log('Stop Tracking');
    this.bgGeo.stop();
    // this.bgGeo.finish();
  }

}
