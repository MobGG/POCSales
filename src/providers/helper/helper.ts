import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class HelperProvider {

  constructor(public http: Http) {
    console.log('Hello HelperProvider Provider');
  }

  convertStringLatLngToDouble(string: string): number {
    let str: string = string;
    let length: number = str.length;
    let latLng: number = +str.substr(1, length);
    // console.log(latLng);
    return latLng;
  }

  isEmpty(string: string): boolean {
    if (string === null) {
      return true;
    }
    else if (typeof string === undefined || string.trim() === '' || string.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  getCurrentDate() {
    let date: Date;
    date = new Date();
    // console.log(date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear());
    return date;
  }

  getDate() {
    let date = this.getCurrentDate();
    return date.getDate();
  }

  getMonth() {
    let date = this.getCurrentDate();
    return date.getMonth() + 1;
  }

  getYear() {
    let date = this.getCurrentDate();
    return date.getFullYear();
  }

  getDateMonthYear() {
    let date = this.getCurrentDate();
    let dmy: string = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    return dmy;
  }
}
