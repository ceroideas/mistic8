import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewPhotoModalPage } from './new-photo-modal.page';

const routes: Routes = [
  {
    path: '',
    component: NewPhotoModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewPhotoModalPageRoutingModule {}
