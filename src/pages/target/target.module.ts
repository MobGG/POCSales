import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverComponentModule } from '../../components/popover/popover.module';
import { Target } from './target';

@NgModule({
  declarations: [
    Target,
  ],
  imports: [
    IonicPageModule.forChild(Target),
    PopoverComponentModule
  ],
  exports: [
    Target
  ]
})
export class TargetModule { }
