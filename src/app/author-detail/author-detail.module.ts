import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthorDetailPageRoutingModule } from './author-detail-routing.module';

import { AuthorDetailPage } from './author-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuthorDetailPageRoutingModule
  ],
  declarations: [AuthorDetailPage]
})
export class AuthorDetailPageModule {}
