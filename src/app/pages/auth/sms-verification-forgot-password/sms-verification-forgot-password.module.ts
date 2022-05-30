import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SmsVerificationForgotPasswordPageRoutingModule } from './sms-verification-forgot-password-routing.module';

import { SmsVerificationForgotPasswordPage } from './sms-verification-forgot-password.page';

import { SharedModule } from '../../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    SmsVerificationForgotPasswordPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [SmsVerificationForgotPasswordPage]
})
export class SmsVerificationForgotPasswordPageModule {}
