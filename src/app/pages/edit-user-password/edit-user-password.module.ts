import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditUserPasswordPageRoutingModule } from './edit-user-password-routing.module';

import { EditUserPasswordPage } from './edit-user-password.page';

import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    EditUserPasswordPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EditUserPasswordPage]
})
export class EditUserPasswordPageModule {}
