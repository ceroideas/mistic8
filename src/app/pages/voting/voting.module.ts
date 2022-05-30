import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VotingPageRoutingModule } from './voting-routing.module';

import { VotingPage } from './voting.page';

import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    VotingPageRoutingModule
  ],
  declarations: [VotingPage]
})
export class VotingPageModule {}
