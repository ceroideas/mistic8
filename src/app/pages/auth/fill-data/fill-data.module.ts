import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FillDataPageRoutingModule } from './fill-data-routing.module';

import { FillDataPage } from './fill-data.page';

import { SharedModule } from '../../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    FillDataPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [FillDataPage]
})
export class FillDataPageModule {}
