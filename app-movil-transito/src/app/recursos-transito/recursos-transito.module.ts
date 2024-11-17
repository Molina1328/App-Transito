import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecursosTransitoPageRoutingModule } from './recursos-transito-routing.module';

import { RecursosTransitoPage } from './recursos-transito.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecursosTransitoPageRoutingModule
  ],
  declarations: [RecursosTransitoPage]
})
export class RecursosTransitoPageModule {}
