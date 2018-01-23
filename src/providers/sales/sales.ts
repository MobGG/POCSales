import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { HelperProvider } from '../helper/helper';

@Injectable()
export class SalesProvider {
  private url: string = 'http://uateservice.sahapat.com/';

  constructor(
    public http: Http,
    public helperProvider: HelperProvider,
  ) {
    console.log('Hello SalesProvider Provider');
  }

  getSalesmanMaster(criteria: any) {
    let day = this.helperProvider.getDate();
    let param = {
      "salesmanCode": criteria.salesmanCode,
      "customerCode": criteria.customerCode,
      // "tripDay": criteria.tripDay
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
      "status": 3 // 1 เปิดบิล 2 เก็บเงิน 3 เยี่ยม
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

}
