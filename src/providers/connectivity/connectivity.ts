import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ConnectivityProvider {

  onDevice: boolean;

  constructor(public platform: Platform, public network: Network) {
    this.onDevice = this.platform.is('cordova');
  }

  isOnline(): boolean {
    // console.log('isOnline : ', navigator.onLine);
    // return navigator.onLine;
    if (this.onDevice && this.network.type) {
      console.log('isDeviceOnline : ', this.network.type !== 'none');
      return this.network.type !== 'none';
    } else {
      console.log('isOnline : ', navigator.onLine);
      return navigator.onLine;
    }
  }
  // ใช้ isOnline อันเดียวก็พอ
  isOffline(): boolean {
    // console.log('isOffline : ', !navigator.onLine);
    // return !navigator.onLine;
    if (this.onDevice && this.network.type) {
      console.log('isDeviceOffline : ', this.network.type === 'none');
      return this.network.type === 'none';
    } else {
      console.log('isOffline : ', !navigator.onLine);
      return !navigator.onLine;
    }
  }

  watchOnline(): Observable<any> {
    return this.network.onConnect();
  }

  watchOffline(): Observable<any> {
    return this.network.onDisconnect();
  }

}
