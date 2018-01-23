import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GetProductPage } from './get-product';

@NgModule({
  declarations: [
    GetProductPage,
  ],
  imports: [
    IonicPageModule.forChild(GetProductPage),
  ],
})
export class GetProductPageModule {}
