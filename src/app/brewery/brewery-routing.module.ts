import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BreweryPage } from './brewery.page';

const routes: Routes = [
  {
    path: '',
    component: BreweryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BreweryPageRoutingModule {}
