import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/auth/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'fill-data',
    loadChildren: () => import('./pages/auth/fill-data/fill-data.module').then( m => m.FillDataPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/auth/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./pages/welcome/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: 'welcome2',
    loadChildren: () => import('./pages/welcome2/welcome2.module').then( m => m.Welcome2PageModule)
  },
  {
    path: 'load-screen',
    loadChildren: () => import('./pages/load-screen/load-screen.module').then( m => m.LoadScreenPageModule)
  },
  {
    path: 'sms-verification',
    loadChildren: () => import('./pages/auth/sms-verification/sms-verification.module').then( m => m.SmsVerificationPageModule)
  },
  {
    path: 'edit-user-data',
    loadChildren: () => import('./pages/edit-user-data/edit-user-data.module').then( m => m.EditUserDataPageModule)
  },
  {
    path: 'options',
    loadChildren: () => import('./pages/options/options.module').then( m => m.OptionsPageModule)
  },
  {
    path: 'edit-user-password',
    loadChildren: () => import('./pages/edit-user-password/edit-user-password.module').then( m => m.EditUserPasswordPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/auth/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'tutorial',
    loadChildren: () => import('./pages/tutorial/tutorial.module').then( m => m.TutorialPageModule)
  },
  {
    path: 'sms-verification-forgot-password',
    loadChildren: () => import('./pages/auth/sms-verification-forgot-password/sms-verification-forgot-password.module').then( m => m.SmsVerificationForgotPasswordPageModule)
  },
  {
    path: '**',
    loadChildren: () => import('./pages/auth/login/login.module').then( m => m.LoginPageModule)
  },




];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
