import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthorDetailPage } from './author-detail.page';

const routes: Routes = [
  {
    path: '',
    component: AuthorDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthorDetailPageRoutingModule {}
