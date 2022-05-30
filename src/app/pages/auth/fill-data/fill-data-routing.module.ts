import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FillDataPage } from './fill-data.page';

const routes: Routes = [
  {
    path: '',
    component: FillDataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FillDataPageRoutingModule {}
