import { Injectable } from '@angular/core';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  LatLng,
  CameraPosition,
  MarkerOptions,
  Marker,
  PolylineOptions,
  Polyline,
  AnimateCameraOptions,
} from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';

import { HelperProvider } from '../../providers/helper/helper';

@Injectable()
export class CordovaGoogleMapProvider {
  mapElement: any;
  map: GoogleMap;

  arrayMarkerOptions: MarkerOptions[] = [];

  constructor(
    public googleMaps: GoogleMaps,
    public geo: Geolocation,
    public helper: HelperProvider
  ) {
    console.log('Hello CordovaGoogleMapProvider Provider');
  }

  init(mapElement: any): Promise<boolean> {
    this.mapElement = mapElement;
    return this.loadMap();
  }

  loadMap(): Promise<boolean> {
    return new Promise((resolve) => {
      this.map = this.googleMaps.create(this.mapElement);
      resolve(true);
    })
  }

  focusOnDevice(): Promise<boolean> {
    return new Promise((resolve, reject) => {

      let geoOption = {
        maximumAge: 0,
        // timeout: 2000,
        enableHighAccuracy: true
      }
      this.geo.getCurrentPosition(geoOption)
        .then((position) => {
          console.log('deviceCoOrd', position);
          let deviceLatLng = new LatLng(position.coords.latitude, position.coords.longitude);
          let cameraPosition: CameraPosition = {
            // target: this.kpsLatLng,
            target: deviceLatLng,
            zoom: 15,
            tilt: 30
          };
          this.map = this.googleMaps.create(this.mapElement);
          // this.clearGoogleMap();
          this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
            this.map.moveCamera(cameraPosition);
          })
          resolve(true);
        }).catch((err) => {
          console.error('errCode', err.code);
          console.error('errMessage', err.message);
          // reject(false);
          return err;
        });
    })
  }

  convertTripsToMarker(trips: any) {
    // console.log(trips);

    // let markerOptions: MarkerOptions[] = [];
    let markerOptions: any[] = [];

    for (let i = 0; i < trips.length; i++) {
      // console.log(trip.title + '' + trip.latitude + '' + trip.longitude);
      // check gpsn & gpse ว่าเป็น null หรือ " " มั้ย
      let emptyLat: boolean = this.helper.isEmpty(trips[i].gpsn);
      let emptyLng: boolean = this.helper.isEmpty(trips[i].gpse);

      let customer: string = trips[i].customerCode + ' ' + trips[i].customerNameThai;
      let address: string = trips[i].address + ' ' + trips[i].districtThai + ' ' + trips[i].amphurThai + ' ' + trips[i].provinceThai
      if (emptyLat && emptyLng) {
        // พี่หนึ่งบอกถ้ามันไม่มีก็ ใส่ของ spc ไป แล้วเพิ่มข้อความ "(ไม่มีพิกัด)"
        let spcLatLng: any = new LatLng(13.7455668, 100.5770069);
        let noGpsText: string = '(ไม่มีพิกัด)';
        markerOptions.push(
          {
            title: customer + noGpsText,
            position: spcLatLng,
            snippet: address,

            customer: customer

          }
        );
      }
      else {
        let lat: number = this.helper.convertStringLatLngToDouble(trips[i].gpsn);
        let lng: number = this.helper.convertStringLatLngToDouble(trips[i].gpse);
        markerOptions.push(
          {
            title: customer,
            position: new LatLng(lat, lng),
            snippet: address,

            customer: customer,
            customerPosition: new LatLng(lat, lng)
          }
        );
      }
    }
    this.arrayMarkerOptions = markerOptions;

    // console.log('markerOptions', markerOptions);
    return markerOptions;
  }

  convertTrackersToPolyline(trackers: any) {
    let points: Array<any> = [];
    for (let i = 0; i < trackers.length; i++) {
      points.push(new LatLng(trackers[i].latitude, trackers[i].longitude));
    }
    let polyLineOptions: PolylineOptions = {
      points: points,
      width: 10,
      color: "blue",
      geodesic: true,
      zIndex: 16
    };
    // console.dir(polyLineOptions);
    return polyLineOptions;
  }

  loadMarker(marker) {
    // this.map.clear();
    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      for (let i = 0; i < marker.length; i++) {
        if (marker[i].position) {
          this.map.addMarker(marker[i]);
        } else {
          console.warn(marker[i] + ' ไม่มีพิกัด');
        }
      }
      // console.log('finish load Marker');
    }).catch((err) => {
      console.error(err)
    });
  }

  goToMarker(markerOption, polyLineOptions) {
    let animateCameraOption: AnimateCameraOptions = {};
    let markerOpts = this.arrayMarkerOptions;
    animateCameraOption.target = markerOption.position;
    animateCameraOption.zoom = 15;
    animateCameraOption.duration = 2000;//default 5000 milli sec

    this.map.animateCamera(animateCameraOption)
      .then(() => {
        this.map.clear();

        for (let i = 0; i < markerOpts.length; i++) {
          if (markerOpts[i].title === markerOption.title) {
            this.map.addMarker(
              {
                position: markerOption.position,
                title: markerOption.title,
                icon: "blue",
                animation: "drop",
                // animation: "bounce",
              }).then((marker: Marker) => {
                marker.showInfoWindow();
                // console.log(marker.getTitle());
              });

          } else {
            this.map.addMarker(markerOpts[i]);
          }
        };
      })
      .catch((err) => { console.error('goToMarker error:', err) });
  }

  drawPolyline(polylineOptions) {
    this.map.clear();
    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      this.map.addPolyline(polylineOptions)
        .then((polyline: Polyline) => {
          polyline.setVisible(true);
        });
    });
    console.log('finish draw polyline');
  }

}
