import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { ReviewModalPageRoutingModule } from './review-modal-routing.module';

import { ReviewModalPage } from './review-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ReviewModalPage


  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    ReviewModalPageRoutingModule
  ],
  declarations: [ReviewModalPage]
})
export class ReviewModalPageModule { }
