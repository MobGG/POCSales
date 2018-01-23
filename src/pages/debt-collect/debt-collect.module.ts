import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DebtCollectPage } from './debt-collect';

@NgModule({
  declarations: [
    DebtCollectPage,
  ],
  imports: [
    IonicPageModule.forChild(DebtCollectPage),
  ],
})
export class DebtCollectPageModule {}
