import { Injectable } from '@angular/core';
import { Diagnostic } from '@ionic-native/diagnostic';
import { ManageFileProvider } from '../../providers/manage-file/manage-file';

@Injectable()
export class DiagnosticProvider {
  constructor(
    private diagnostic: Diagnostic,
    private manageFile: ManageFileProvider,
  ) {

  }

  listennerBluetoothStatus() {
    // this.diagnostic.registerBluetoothStateChangeHandler(state => {
    this.diagnostic.registerBluetoothStateChangeHandler(function (state) {
      // "unknown", "resetting", "unsupported", "unauthorized", "powered_off", "powered_on"
      let status: boolean;
      if (state === 'powered_on') {
        // status = true;
        // alert('bluetoothIsEnabled is ' + status);
      } else if (state === 'powered_off') {
        // status = false;
        // alert('bluetoothIsEnabled is ' + status);

        // this.files.removeFile();
        this.files.writeEmpty();
      }
      // });
    }.bind(this));
  }

}
