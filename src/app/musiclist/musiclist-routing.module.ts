import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MusiclistPage } from './musiclist.page';

const routes: Routes = [
  {
    path: '',
    component: MusiclistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MusiclistPageRoutingModule {}
