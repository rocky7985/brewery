import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BreweryPageRoutingModule } from './brewery-routing.module';

import { BreweryPage } from './brewery.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BreweryPageRoutingModule
  ],
  declarations: [BreweryPage]
})
export class BreweryPageModule {}
