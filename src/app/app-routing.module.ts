import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminHomeComponent } from './features/private/admin-home/admin-home.component';
import { UserHomeComponent } from './features/private/user-home/user-home.component';
import { AdminLoginComponent } from './features/public/admin-login/admin-login.component';
import { UserLoginComponent } from './features/public/user-login/user-login.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login-user',
    pathMatch: 'full',
  },
  { path: 'login-admin', component: AdminLoginComponent },
  { path: 'login-user', component: UserLoginComponent },
  { path: 'home-admin', component: AdminHomeComponent },
  { path: 'home-user', component: UserHomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
