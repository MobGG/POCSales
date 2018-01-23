import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreatePromotionModalPage } from './create-promotion-modal';

@NgModule({
  declarations: [
    CreatePromotionModalPage,
  ],
  imports: [
    IonicPageModule.forChild(CreatePromotionModalPage),
  ],
})
export class CreatePromotionModalPageModule {}
