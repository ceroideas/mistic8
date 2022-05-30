import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditUserDataPageRoutingModule } from './edit-user-data-routing.module';

import { EditUserDataPage } from './edit-user-data.page';

import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    EditUserDataPageRoutingModule,
    ReactiveFormsModule, 
  ],
  declarations: [EditUserDataPage]
})
export class EditUserDataPageModule {}
