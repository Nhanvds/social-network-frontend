import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { TokenService } from '../service/token.service';
import { Router } from '@angular/router';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn:'root'
})
export class AuthGuard{
  constructor(
    private tokenService: TokenService,
    private router: Router
  ){}

  canActivate(next:ActivatedRouteSnapshot, state:RouterStateSnapshot){
    const isTokenExpired = this.tokenService.isTokenExpired();
    const isUserIdValid = this.tokenService.getUserId() >0;
    // const role =  kiem tra role
    // debugger
    if(!isTokenExpired&& isUserIdValid){
      return true;
    }else{
      this.router.navigate(["/login"])
      return false;
    }
  }
}

export const authGuardFn: CanActivateFn = (route, state) => {
  
  return inject(AuthGuard).canActivate(route,state);
};
