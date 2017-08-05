import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReviewCreatePage } from './review-create';

@NgModule({
  declarations: [
    ReviewCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(ReviewCreatePage),
  ],
  exports: [
    ReviewCreatePage
  ]
})
export class ReviewCreatePageModule {}
