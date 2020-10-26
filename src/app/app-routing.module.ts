import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'musicplayer',
    loadChildren: () => import('./musicplayer/musicplayer.module').then( m => m.MusicplayerPageModule)
  },
  {
    path: 'musiclist',
    loadChildren: () => import('./musiclist/musiclist.module').then( m => m.MusiclistPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'authors',
    loadChildren: () => import('./authors/authors.module').then( m => m.AuthorsPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'bookmarks',
    loadChildren: () => import('./bookmarks/bookmarks.module').then( m => m.BookmarksPageModule)
  },
  {
    path: 'author-detail',
    loadChildren: () => import('./author-detail/author-detail.module').then( m => m.AuthorDetailPageModule)
  },
  {
    path: 'album-detail',
    loadChildren: () => import('./album-detail/album-detail.module').then( m => m.AlbumDetailPageModule)
  },
  {
    path: 'qr-scanner',
    loadChildren: () => import('./qr-scanner/qr-scanner.module').then( m => m.QrScannerPageModule)
  },  {
    path: 'terms',
    loadChildren: () => import('./terms/terms.module').then( m => m.TermsPageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
