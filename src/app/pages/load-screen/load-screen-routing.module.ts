import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoadScreenPage } from './load-screen.page';

const routes: Routes = [
  {
    path: '',
    component: LoadScreenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoadScreenPageRoutingModule {}
