import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EntidadesTransitoPage } from './entidades-transito.page';

const routes: Routes = [
  {
    path: '',
    component: EntidadesTransitoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntidadesTransitoPageRoutingModule {}
