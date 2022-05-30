import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'upload',
        loadChildren: () => import('../new-photo-modal/new-photo-modal.module').then(m => m.NewPhotoModalPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: 'voting',
        loadChildren: () => import('../voting/voting.module').then(m => m.VotingPageModule)
      },
      {
        path: 'options',
        loadChildren: () => import('../options/options.module').then(m => m.OptionsPageModule)
      },
      {
        path: '',
        redirectTo: '/load-screen',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/load-screen',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
