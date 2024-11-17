import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CodigoTransitoPage } from './codigo-transito.page';

const routes: Routes = [
  {
    path: '',
    component: CodigoTransitoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CodigoTransitoPageRoutingModule {}
