import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CommonModule } from '@angular/common';
import { authGuardFn } from './guards/auth.guard';
import { AppComponent } from './app.component';

const routes: Routes = [
  {path:'',component:HomeComponent,canActivate:[authGuardFn]},
  {path:'home',component:HomeComponent,canActivate:[authGuardFn]},
  {path:'users/login',component:LoginComponent}, 
  {path:'users/register',component:RegisterComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes),CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
