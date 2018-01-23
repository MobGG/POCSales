import { Component } from '@angular/core';
import {
  IonicPage,
  Platform,
  PopoverController
} from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { LoadingProvider } from '../../providers/loading/loading';
import { SalesProvider } from '../../providers/sales/sales';
import { ConnectivityProvider } from '../../providers/connectivity/connectivity';

@IonicPage()
@Component({
  selector: 'page-target',
  templateUrl: 'target.html',
})
export class Target {
  allSalesTarget: any;
  salesTarget: any;

  constructor(
    private platform: Platform,
    private popoverCtrl: PopoverController,
    private loadingProvider: LoadingProvider,
    private storage: Storage,
    private salesProvider: SalesProvider,
    private connectivityService: ConnectivityProvider,
  ) {
    console.log('summary');
  }

  ionViewDidLoad() {
    this.initSalesTarget();
  }

  initSalesTarget() {
    if (this.connectivityService.isOnline()) {
      this.platform.ready().then(() => {
        let content = 'กำลังเตรียมเป้าหมาย...';
        let loader = this.loadingProvider.showLoading(content);
        this.storage.ready().then(() => {
          this.storage.get('AuthToken').then(user => {
            let criteria = {
              "salesmanCode": user.usercode,
            }
            this.salesProvider.getTargetSalesmanOrderHist(criteria)
              .subscribe((res) => {
                console.log('results', res);
                if (res !== null) {
                  this.allSalesTarget = res.TargetSalesman;
                  this.salesTarget = res.TargetSalesman;
                }
              }, (err) => {
                console.warn('error', err);
                loader.dismiss();
              }, () => {
                loader.dismiss();
              })
          }).catch((err) => {
            console.error('errorGetTarget ', err);
          });
        });
      });
    } else {
      alert('โปรดต่อเน็ต');
    }
  }

  searchTarget(searchEvent: any) {
    let searchTerm: string = searchEvent.target.value
    if (searchTerm.trim() != '') {
      this.salesTarget = this.salesTarget.filter((target) => {
        return (target.productcode.indexOf(searchTerm) > -1) || (target.productnamethai.indexOf(searchTerm) > -1) || (target.palmproductnamet.indexOf(searchTerm) > -1);
      });
    } else if (searchTerm.trim() == '') {
      this.salesTarget = this.allSalesTarget;
    }
  }

  clearSearch(searchEvent: any) {
    this.salesTarget = this.allSalesTarget;
  }

  sortTarget(rule: string, orderBy: string) {
    // let arr: any[] = this.salesTarget;
    // return arr.sort((a, b) => {
    let sortedArray: any[] = this.salesTarget.sort((a, b) => {
      let x = a[rule];
      let y = b[rule];

      if (typeof x == "string") {
        x = x.trim().toLowerCase();
      }
      if (typeof y == "string") {
        y = y.trim().toLowerCase();
      }

      if (x < y) {
        return -1;
      }
      if (x > y) {
        return 1;
      }
      return 0;
    });

    if (orderBy === 'asc') {
      console.log('sortByAsc', sortedArray);
      return sortedArray;
    } else if (orderBy === 'desc') {
      console.log('sortByDesc', sortedArray);
      return sortedArray.reverse();
    }

  }

  presentPopover(ev) {
    console.log('push');
    let popover = this.popoverCtrl.create('PopoverComponent', {});
    popover.present({
      ev: ev
    });
    popover.onDidDismiss((key: string, orderBy: string) => {
      // let popovertext = rule;
      // console.log(popovertext);
      this.sortTarget(key, orderBy);
    });
  }

}
