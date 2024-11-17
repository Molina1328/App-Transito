import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InfraccionesTransitoPageRoutingModule } from './infracciones-transito-routing.module';

import { InfraccionesTransitoPage } from './infracciones-transito.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InfraccionesTransitoPageRoutingModule
  ],
  declarations: [InfraccionesTransitoPage]
})
export class InfraccionesTransitoPageModule {}
