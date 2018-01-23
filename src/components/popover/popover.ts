import { Component } from '@angular/core';
import { IonicPage, ViewController, PopoverController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'popover',
  templateUrl: 'popover.html'
})
export class PopoverComponent {
  filterList = [
    {
      name: 'codeAsc',
      value: 'รหัสจากน้อยไปมาก',
      key: 'productcode',
      orderBy: 'asc'
    },
    {
      name: 'codeDesc',
      value: 'รหัสจากมากไปน้อย',
      key: 'productcode',
      orderBy: 'desc'
    },
    {
      name: 'targetAsc',
      value: 'เป้าหมายจากน้อยไปมาก',
      key: 'quantitycase',
      orderBy: 'asc'
    },
    {
      name: 'targetDesc',
      value: 'เป้าหมายจากมากไปน้อย',
      key: 'quantitycase',
      orderBy: 'desc'
    },
    {
      name: 'salesAsc',
      value: 'ยอดขายจากน้อยไปมาก',
      key: 'sumprdtQty',
      orderBy: 'asc'
    },
    {
      name: 'salesDesc',
      value: 'ยอดขายจากมากไปน้อย',
      key: 'sumprdtQty',
      orderBy: 'desc'
    }
  ]
  constructor(
    private viewCtrl: ViewController,
    private popoverCtrl: PopoverController
  ) {
    console.log('Hello PopoverComponent Component');
  }

  setSelectedFilter(key: string, orderBy: string) {
    // TODO add key and asc,desc 
    this.viewCtrl.dismiss(key, orderBy);
  }

}
