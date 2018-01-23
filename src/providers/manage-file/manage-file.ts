import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file';

@Injectable()
export class ManageFileProvider {

  constructor(public file: File) {
    console.log('Hello ManageFileProvider Provider');
  }

  checkDir() {
    this.file.checkDir(this.file.externalRootDirectory, '')// Download
      // this.file.checkDir(this.file.externalRootDirectory, 'Download')// Download
      .then(_ => {
        console.log('Directory exists');
        alert('Directory ' + this.file.externalRootDirectory + 'is exists.');// Download
        // alert('Directory ' + this.file.externalRootDirectory + 'Download ' + 'is exists.');// Download
      })
      .catch(err => {
        console.warn('Directory doesnt exist', err);
        alert('Directory ' + this.file.externalRootDirectory + 'is not exists.');// Download
        // alert('Directory ' + this.file.externalRootDirectory + 'Download ' + 'is not exists.');// Download
      });
  }

  checkFile() {
    this.file.checkFile(this.file.externalRootDirectory, 'spc.dat')
      .then(res => {
        console.log('File ' + this.file.externalRootDirectory + ' spc.dat is exists');
        alert('File spc.dat is exists');
      })
      .catch(err => {
        console.warn('File ' + this.file.externalRootDirectory + ' spc.dat is not exists');
        alert('File spc.dat is not exists');
      });
  }

  writeNewFile() {
    let text = '';
    let writeOption = {
      "replace": true
    }
    this.file.writeFile(this.file.externalRootDirectory, 'spc.dat', text, writeOption)
      .then(res2 => {
        console.log('write' + res2);
        alert('write dat');
      })
      .catch(err => {
        console.warn('write error:', err);
        alert('ERROR!');
      });
  }

  writeEmpty() {
    let filePath = this.file.externalRootDirectory;
    let fileName = 'spc.dat';
    let text = '';
    let writeOption = {
      "replace": true
    }
    this.file.writeFile(filePath, fileName, text, writeOption)
      .then(res => {
        console.log('write' + res);
        alert('write empty');
      })
      .catch(err => {
        console.warn('write error:', err);
        alert('ERROR!');
      });
  }

  removeFile() {
    let filePath = this.file.externalRootDirectory;
    let fileName = 'spc.dat';
    this.file.removeFile(filePath, fileName)
      .then(res => {
        console.log(res);
        alert('remove success.');
      })
      .catch(err => {
        console.warn('remove error:', err);
        alert('ERROR!' + err);
      });
  }

  mockDataForPrint() {
    let product: any[] = [
      {
        'productCode': '111013',
        'productName': 'ฟลอเร่ขมิ้น',
        'productPrice': '1,050.00',
        'discountPercent': '0.00',
        'discount': '0.00',
        'qty': '0',
        'qtyp': '1',
        'total': '29.16'
      },
      {
        'productCode': '111021',
        'productName': 'ฟลอเร่ว่านหางจระเข้',
        'productPrice': '1,050.00',
        'discountPercent': '0.00',
        'discount': '0.00',
        'qty': '0',
        'qtyp': '1',
        'total': '29.16'
      },
      {
        'productCode': '3',
        'productName': 'aaa',
        'productPrice': '123.00',
        'discountPercent': '0.00',
        'discount': '0.00',
        'qty': '0',
        'qtyp': '1',
        'total': '10.00'
      },
      {
        'productCode': '4',
        'productName': 'sss',
        'productPrice': '123.00',
        'discountPercent': '0.00',
        'discount': '0.00',
        'qty': '0',
        'qtyp': '1',
        'total': '10.00'
      }
    ];
    let premiumProduct: any[] = [
      {
        'productCode': '111013',
        'premiumProductCode': '5',
        'premiumProductName': 'ddd',
        'qty': '0',
        'qtyp': '1'
      },
      {
        'productCode': '111021',
        'premiumProductCode': '6',
        'premiumProductName': 'fff',
        'qty': '0',
        'qtyp': '1'
      }
    ]
    let mockData = {
      'product': product,
      'premiumProduct': premiumProduct
    }
    return mockData
  }

  // start text helper
  // lenthai
  lengthThai(thText: string): number {
    // สระภาษาไทย พวกที่อยู่บน อยู่ล่าง และ วรรณยุกต์
    // https://unicode-table.com/en/#0E31 
    let subCharactorArray: any[] = [/\u0e31/g, /\u0e34/g, /\u0e35/g, /\u0e36/g, /\u0e37/g, /\u0e38/g, /\u0e39/g, /\u0e47/g, /\u0e48/g, /\u0e49/g, /\u0e4a/g, /\u0e4b/g, /\u0e4c/g];
    let thSubCharactorQty: any[] = [];
    let thTextLength: number = 0;

    thTextLength = thText.length;
    for (let subChar of subCharactorArray) {
      thSubCharactorQty = thText.match(subChar);
      if (thSubCharactorQty !== null && thSubCharactorQty.length > 0 && thTextLength !== 0) {
        thTextLength -= thSubCharactorQty.length;
      }
    }
    return thTextLength;
  }

  // txtnum
  numberWithCommasAndDecimal(x: number): string {
    // return numberWithCommasAnd2decimal
    // https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
    // https://stackoverflow.com/questions/25127054/regex-format-string-number-with-commas-and-2-decimals-in-javascript
    var parts = x.toFixed(2).toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ","); // regex
    return parts.join(".");
  }

  formatText(inputText: string, columnLength: number, position: string): string {
    let textAfterFormat: string;
    let space: string = this.txtDup(' ', columnLength);
    let inputTextLength: number = this.lengthThai(inputText);
    if (position === 'l') {
      textAfterFormat = inputText + space.slice(inputTextLength);
    } else if (position === 'r') {
      textAfterFormat = space.slice(inputTextLength) + inputText;
    } else if (position === 'c') {
      let spaceLength = Math.floor((columnLength - inputTextLength) / 2);
      let space = this.txtDup(' ', spaceLength);
      textAfterFormat = space + inputText + space;
      if (columnLength - (spaceLength + spaceLength + inputTextLength) > 0) {
        textAfterFormat += ' ';
      }
    }
    return textAfterFormat;
  }

  formatText1(inputText: string, columnLength: number, position: string): string {
    let textAfterFormat: string;
    let space: string = this.txtDup(' ', columnLength);
    let inputTextLength: number = Math.round(1.78 * this.lengthThai(inputText));
    if (position === 'l') {
      textAfterFormat = inputText + space.slice(inputTextLength);
    } else if (position === 'r') {
      textAfterFormat = space.slice(inputTextLength) + inputText;
    } else if (position === 'c') {
      let spaceLength = Math.floor((columnLength - inputTextLength) / 2);
      let space = this.txtDup(' ', spaceLength);
      textAfterFormat = space + inputText + space;
      if (columnLength - (spaceLength + spaceLength + inputTextLength) > 0) {
        textAfterFormat += ' ';
      }
    }
    return textAfterFormat;
  }

  // txtdup
  txtDup(anyString: string, numberOfDup: number) {
    // duplicate any input string
    let space: string = '';
    for (let b = 0; b < numberOfDup; b++) {
      space += anyString;
    }
    return space;
  }

  // end text helper

  // start gen print 
  // ใบเบิก ใบคืน

  // docType = C , docNo = 51 or 52
  genStockDoc(docType: string | null, docNo: string) {
    let text: string = '';
    let docTypeText: string = ''; // if Confirm
    let isoIdText: string = ''; // if Confirm
    let confirmSignatureText: string = ''; // if Confirm
    let subHeaderText: string = '';

    let docData: any = {
      'docCode': 'C50012180001',
      'docDate': '2015/12/18',
      'salesCode': 'C500',
      'salesName': 'นันทิดา ทองคำ',
      'srCode': 'R509',
      'srName': 'สร. นางสุนิดา พัชรพานิช',
      'products': [
        {
          'productCode': '624015',
          'productName': 'อสร. น้ำส้มกลั่น 700',
          'packingSize': '12',
          'qty': '1',
          'qtyp': '0'
        }
        , {
          'productCode': '',
          'productName': '',
          'packingSize': '',
          'qty': '',
          'qtyp': ''
        }
      ],
      'netTotal': ''
    };
    text += this.formatText('บริษัท สหพัฒนพิบูล จำกัด (มหาชน)', 111, 'c') + '\n';
    // type header
    if (docNo === '51') {
      docTypeText = 'ใบเบิกสินค้า (Form 51)';
    } else if (docNo === '52') {
      docTypeText = 'ใบคืนสินค้า (Form 52)';
    }
    if (docType) {
      docTypeText += '(Confirm)\n';
      if (docNo === '51') {
        isoIdText = this.formatText('F-STK-003-19/07/99', 73, 'l');
      } else if (docNo === '52') {
        isoIdText = this.formatText('F-STK-010-01/08/58', 73, 'l');
      }
      isoIdText += this.formatText('เลขที่ ' + docData.docCode, 35, 'r') + '\n';
      confirmSignatureText = this.txtDup(' ', 10) + this.txtDup('_', 20) + this.txtDup(' ', 10) + this.txtDup('_', 20) + this.txtDup(' ', 10) + this.txtDup('_', 20) + '\n'; // ขีดเส้นสำหรับลายเซ็น 
      confirmSignatureText += this.txtDup(' ', 10) + this.formatText('พนักงานขาย', 20, 'c') + this.txtDup(' ', 10) + this.formatText('พนักงานขับรถ', 20, 'c') + this.txtDup(' ', 10) + this.formatText('ตัวแทน สร.', 20, 'c') + '\n'; // ข้อความกำกับใต้เส้น
    } else {
      docTypeText += '\n'
    }
    docTypeText = this.formatText(docTypeText, 101, 'c') + this.formatText('Page ', 8, 'r');
    // type header
    // start sub header
    subHeaderText = this.formatText('วันที่ ' + docData.docDate, 15, 'l') + this.formatText('รหัสพนักงานขาย ' + docData.salesCode, 25, 'l') + 'ชื่อพนักงานขาย ' + docData.salesName + '\n';
    subHeaderText += this.formatText('รหัสสร. ' + docData.srCode, 25, 'l') + ' ชื่อสร. ' + docData.srName + '\n';
    subHeaderText += '|' + this.txtDup('-', 92) + '|\n';
    subHeaderText += '|' + this.formatText('ลำดับ', 5, 'c') + '|' + this.formatText('รหัส-ชื่อ สินค้า', 56, 'c') + '|' + this.formatText('บรรจุ', 10, 'c') + '|' + this.formatText('จำนวน เต็ม/เศษ', 18, 'c') + '|\n';
    subHeaderText += '|' + this.txtDup('-', 92) + '|\n';
    // end sub header
    // start for loop product data
    for (let product of docData.products) {
      // console.log(product);
    }
    // end for loop product data
    console.log(text += docTypeText + isoIdText + subHeaderText + confirmSignatureText);
  }
  // end gen print

  // gen ใบเสร็จรับเงิน

  billHeader1(orderData, headerText) {

  }
  billHeader2(orderData, headerText) {

  }
  billHeader3(orderData, headerText) {

  }

  billBody1(orderData) {

  }
  billBody2(orderData) {

  }
  billBody3(orderData) {

  }

  billTail1(netTotal, billType: string, isoId: string) {

  }
  billTail2(netTotal, billType: string) {

  }

  printBill3A(orderData) {
    let billText = "";
    let netTotal = orderData.netTotal;
    billText += this.billHeader1(orderData, "ใบเสร็จรับเงิน/ใบกำกับภาษี");
    billText += this.billBody1(orderData);
    billText += this.billTail1(netTotal, "สด", "F-ACC-022-01/08/15");
    billText += this.billBody3(orderData);
    return billText;
  }
  printBill3B(orderData) {
    let billText = "";
    let netTotal = orderData.netTotal;
    billText += this.billHeader2(orderData, "ใบเสร็จรับเงิน/ใบกำกับภาษี(ย่อ)");
    billText += this.billBody2(orderData);
    billText += this.billTail1(netTotal, "สด", "F-ACC-022/1-01/08/15");
    billText += this.billBody3(orderData);
    return billText;
  }
  printBill3C(orderData) {
    let billText = "";
    let netTotal = orderData.netTotal;
    billText += this.billHeader2(orderData, "ใบเสร็จรับเงิน/ใบกำกับภาษี(ย่อ)");
    billText += this.billBody2(orderData);
    billText += this.billTail1(netTotal, "สด", "F-ACC-022-01/08/15");
    billText += this.billBody3(orderData);
    return billText;
  }
  printBill3D(orderData) {
    let billText = "";
    let netTotal = orderData.netTotal;
    billText += this.billHeader1(orderData, "ใบเสร็จรับเงิน/ใบกำกับภาษี");
    billText += this.billBody1(orderData);
    billText += this.billTail1(netTotal, "สด", "F-ACC-022-01/08/15");
    billText += this.billBody3(orderData);
    return billText;
  }
  printBill3E(orderData) {
    let billText = "";
    let netTotal = orderData.netTotal;
    billText += this.billHeader1(orderData, "ใบเสร็จรับเงิน/ใบกำกับภาษี");
    billText += this.billBody1(orderData);
    billText += this.billTail1(netTotal, "สด", "F-ACC-022-01/08/15");
    billText += this.billBody3(orderData);
    return billText;
  }

}
