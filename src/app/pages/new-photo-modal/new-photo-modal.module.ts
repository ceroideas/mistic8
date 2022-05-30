import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewPhotoModalPageRoutingModule } from './new-photo-modal-routing.module';

import { NewPhotoModalPage } from './new-photo-modal.page';
import { FormatFileSizePipe } from './format-file-size-pipe';

import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    NewPhotoModalPageRoutingModule
  ],
  declarations: [NewPhotoModalPage, FormatFileSizePipe]
})
export class NewPhotoModalPageModule {}
