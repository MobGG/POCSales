import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';

// ionic native provider
import { Network } from '@ionic-native/network';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { File } from '@ionic-native/file';

// custom provider
import { ConnectivityProvider } from '../providers/connectivity/connectivity';
import { LoadingProvider } from '../providers/loading/loading';
import { HelperProvider } from '../providers/helper/helper';
import { CordovaGoogleMapProvider } from '../providers/cordova-google-map/cordova-google-map';
import { NavigatorService } from '../providers/navigator-service';
import { LocationTrackerProvider } from '../providers/location-tracker/location-tracker';

// api provider
import { AuthProvider } from '../providers/auth/auth';
import { SalesProvider } from '../providers/sales/sales';
import { ProductProvider } from '../providers/product/product';
import { PromotionProvider } from '../providers/promotion/promotion';
import { ManageFileProvider } from '../providers/manage-file/manage-file';
import { DiagnosticProvider } from '../providers/diagnostic/diagnostic';
import { VansalesProvider } from '../providers/vansales/vansales';

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: true,
    }),
    IonicStorageModule.forRoot({
      name: 'SmartVanSales',
      driverOrder: ['sqlite', 'indexeddb', 'websql']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    SplashScreen,
    StatusBar,
    Network,
    GoogleMaps,
    Geolocation,
    LaunchNavigator,
    BackgroundGeolocation,
    Diagnostic,
    File,
    {
      provide: ErrorHandler,
      useClass: IonicErrorHandler
    },
    ConnectivityProvider,
    LoadingProvider,
    HelperProvider,
    CordovaGoogleMapProvider,
    LocationTrackerProvider,
    NavigatorService,
    AuthProvider,
    SalesProvider,
    ProductProvider,
    PromotionProvider,
    ManageFileProvider,
    DiagnosticProvider,
    VansalesProvider,
  ]
})
export class AppModule { }
