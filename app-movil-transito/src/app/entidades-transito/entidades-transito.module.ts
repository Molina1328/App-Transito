import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EntidadesTransitoPageRoutingModule } from './entidades-transito-routing.module';

import { EntidadesTransitoPage } from './entidades-transito.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EntidadesTransitoPageRoutingModule
  ],
  declarations: [EntidadesTransitoPage]
})
export class EntidadesTransitoPageModule {}
