import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class PromotionProvider {
  url: string = '';
  constructor(
    private http: Http
  ) {
    console.log('Hello PromotionProvider Provider');
    this.url = 'http://uateservice.sahapat.com/';
  }

  getPromotionMasterALL(appParam, productCode): Observable<any> {
    let promotionType: string = '';
    let salesCash: string = 'C';
    let salesCredit: string = 'S';
    let salesLeader: string = 'SL';
    if (appParam.salesman.usercode.indexOf(salesCash) !== -1) {
      promotionType = 'CC';
    } else if (appParam.salesman.usercode.indexOf(salesCredit) !== -1) {
      promotionType = 'CR';
    } else {
      promotionType = 'C5';
    }
    let param = {
      "divisionSale": appParam.salesman.divisioncode,
      "promotionType": promotionType,
      "customerArea": appParam.customer.customerArea,
      "productCode": productCode
    };
    return this.http.post(this.url + 'spcmaster/getPromotionMasterALL', param)
      .map(res => {
        if (res.json().success) {
          // console.log('promotionList', res.json().results);
          return res.json().results;
        }
      });
  }

  searchPromotion(searchTerm, allPromotionList) {
    let showList: any[] = [];
    // let searchTerm: string = searchEvent.target.value;
    // if (searchTerm.trim() != '' && searchTerm.trim().length > 2) {
    let hasSectionCode: boolean;
    for (let i: number = 0; i < allPromotionList.length; i++) {
      if (allPromotionList[i].sectioncode === searchTerm) {
        hasSectionCode = true;
        // console.log('hasSectionCode =', hasSectionCode);
        break;
      }
    }
    if (hasSectionCode) {
      showList = allPromotionList.filter((promotion) => {
        return promotion.sectioncode === searchTerm;
      });
      return showList;
    } else {
      showList = allPromotionList.filter((promotion) => {
        return (promotion.productcode.indexOf(searchTerm) > -1)
          || (promotion.productnamethai.indexOf(searchTerm) > -1)
          || (promotion.brandname.indexOf(searchTerm) > -1)
        // || (promotion.assortedproductgroup.indexOf(searchTerm) > -1);
      });
      return showList;
    }
  }

}
