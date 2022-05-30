import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoadScreenPageRoutingModule } from './load-screen-routing.module';

import { LoadScreenPage } from './load-screen.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoadScreenPageRoutingModule
  ],
  declarations: [LoadScreenPage]
})
export class LoadScreenPageModule {}
