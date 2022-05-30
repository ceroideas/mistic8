import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SmsVerificationPageRoutingModule } from './sms-verification-routing.module';

import { SmsVerificationPage } from './sms-verification.page';
import { RegisterPageRoutingModule } from '../register/register-routing.module';

import { SharedModule } from '../../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    SmsVerificationPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [SmsVerificationPage]
})
export class SmsVerificationPageModule {}
