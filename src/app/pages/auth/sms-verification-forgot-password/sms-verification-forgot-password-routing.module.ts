import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SmsVerificationForgotPasswordPage } from './sms-verification-forgot-password.page';

const routes: Routes = [
  {
    path: '',
    component: SmsVerificationForgotPasswordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SmsVerificationForgotPasswordPageRoutingModule {}
