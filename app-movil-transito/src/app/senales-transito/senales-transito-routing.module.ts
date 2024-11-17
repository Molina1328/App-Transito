import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SenalesTransitoPage } from './senales-transito.page';

const routes: Routes = [
  {
    path: '',
    component: SenalesTransitoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SenalesTransitoPageRoutingModule {}
