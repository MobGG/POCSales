import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';

declare var google;

@Injectable()
export class MapService {

  map: any;
  markers: any;

  constructor(public geo: Geolocation) {
    // console.log('Hello MapService Provider');
  }

  loadMap(mapElement: any) {

    this.geo.getCurrentPosition().then(
      (position) => {

        // let latLng = new google.maps.LatLng(-34.9290, 138.6010);
        let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        let polygon = [
          { lat: 13.741844628159217, lng: 100.60062646865845 },
          { lat: 13.749077198993833, lng: 100.57045698165892 },
          { lat: 13.750390293084857, lng: 100.54874181747437 },
          { lat: 13.752537081848029, lng: 100.5373477935791 },
          { lat: 13.748180955941766, lng: 100.53629636764525 },
          { lat: 13.7400937705248, lng: 100.60030460357666 },
          { lat: 13.741844628159217, lng: 100.60062646865845 },
        ];

        let geofence = new google.maps.Polygon({ paths: polygon });

        this.map = new google.maps.Map(mapElement, mapOptions);

        google.maps.event.addListener(this.map, 'click', event => {
          console.log(google.maps.geometry.poly.containsLocation(latLng, geofence));
        });

        // var marker = new google.maps.Marker({
        //   position: new google.maps.LatLng(13.7452459, 100.5795549),
        //   map: this.map,
        //   title: 'Hello World!'
        // });

      },
      (err) => {
        console.log(err);
      });

  }

  addMarker(trips) {
    for (let i = 0; i < trips.length; i++) {
      let marker = new google.maps.Marker({
        position: new google.maps.LatLng(trips[i].latitude, trips[i].longitude),
        map: this.map,
        title: trips[i].title
      });

    }
  }

}
