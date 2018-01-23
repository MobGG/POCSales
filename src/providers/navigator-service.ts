import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';

@Injectable()
export class NavigatorService {

  constructor(private launchNavigator: LaunchNavigator) { }

  startNavigation(destination, start) {
    let options: LaunchNavigatorOptions = {
      start: start,
      app: this.launchNavigator.APP.GoogleMaps,
    };

    // this.launchNavigator.navigate(destination, {
    //   start: start
    // });
    this.launchNavigator.navigate(destination, options).then(
      success => console.log('Launched navigator'),
      error => console.log('Error launching navigator', error)
    );

  }
}

