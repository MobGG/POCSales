import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomPromotionPage } from './custom-promotion';

@NgModule({
  declarations: [
    CustomPromotionPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomPromotionPage),
  ],
})
export class CustomPromotionPageModule {}
