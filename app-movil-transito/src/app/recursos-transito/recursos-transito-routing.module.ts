import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecursosTransitoPage } from './recursos-transito.page';

const routes: Routes = [
  {
    path: '',
    component: RecursosTransitoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecursosTransitoPageRoutingModule {}
