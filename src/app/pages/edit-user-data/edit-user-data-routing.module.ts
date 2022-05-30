import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditUserDataPage } from './edit-user-data.page';

const routes: Routes = [
  {
    path: '',
    component: EditUserDataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditUserDataPageRoutingModule {}
