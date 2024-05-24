import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CommonModule } from '@angular/common';
import { authGuardFn } from './guards/auth.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { PostComponent } from './components/post/post.component';
import { AppComponent } from './app.component';
import { UserComponent } from './components/user/user.component';
import { AdminComponent } from './components/admin/admin.component';
import { ManagePostComponent } from './components/manage-post/manage-post.component';
import { ManageUserComponent } from './components/manage-user/manage-user.component';

const routes: Routes = [
  {
    path:'',
    component: UserComponent,
    children:[
      {path:'',component:PostComponent,canActivate:[authGuardFn]},
      {path:'posts/:userId',component:ProfileComponent,canActivate:[authGuardFn]},
      {path:'login',component:LoginComponent}, 
      {path:'register',component:RegisterComponent},
    ]

  }
  ,
  {
    path: 'admin',
    component: AdminComponent,
    children:[
      {path:'post',component:ManagePostComponent},
      {path:'user',component:ManageUserComponent},
    ]
    
    
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes),CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
