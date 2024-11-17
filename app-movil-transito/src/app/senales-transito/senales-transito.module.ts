import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SenalesTransitoPageRoutingModule } from './senales-transito-routing.module';

import { SenalesTransitoPage } from './senales-transito.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SenalesTransitoPageRoutingModule
  ],
  declarations: [SenalesTransitoPage]
})
export class SenalesTransitoPageModule {}
