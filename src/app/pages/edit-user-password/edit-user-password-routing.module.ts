import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditUserPasswordPage } from './edit-user-password.page';

const routes: Routes = [
  {
    path: '',
    component: EditUserPasswordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditUserPasswordPageRoutingModule {}
