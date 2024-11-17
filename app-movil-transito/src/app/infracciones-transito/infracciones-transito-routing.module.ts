import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InfraccionesTransitoPage } from './infracciones-transito.page';

const routes: Routes = [
  {
    path: '',
    component: InfraccionesTransitoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InfraccionesTransitoPageRoutingModule {}
