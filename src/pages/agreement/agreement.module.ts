import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AgreementPage } from './agreement';

@NgModule({
  declarations: [
    AgreementPage,
  ],
  imports: [
    IonicPageModule.forChild(AgreementPage),
  ],
  exports: [
    AgreementPage
  ]
})
export class AgreementPageModule {}
