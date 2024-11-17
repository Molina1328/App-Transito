import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CodigoTransitoPageRoutingModule } from './codigo-transito-routing.module';

import { CodigoTransitoPage } from './codigo-transito.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CodigoTransitoPageRoutingModule
  ],
  declarations: [CodigoTransitoPage]
})
export class CodigoTransitoPageModule {}
