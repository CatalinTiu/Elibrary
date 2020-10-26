import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MusiclistPageRoutingModule } from './musiclist-routing.module';

import { MusiclistPage } from './musiclist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MusiclistPageRoutingModule
  ],
  declarations: [MusiclistPage]
})
export class MusiclistPageModule {}
