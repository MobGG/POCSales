import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MySplashScreenPage } from './my-splash-screen';

@NgModule({
  declarations: [
    MySplashScreenPage,
  ],
  imports: [
    IonicPageModule.forChild(MySplashScreenPage),
  ],
  exports: [
    MySplashScreenPage
  ]
})
export class MySplashScreenPageModule {}
