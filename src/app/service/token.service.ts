import { Injectable } from "@angular/core";
import {JwtHelperService } from "@auth0/angular-jwt"

@Injectable({
    providedIn:'root'
})
export class TokenService{
    private readonly TOKEN_KEY ='token-key';
    private jwtHelperService = new JwtHelperService();
    constructor(){
    }

    getToken():string{
        return localStorage.getItem(this.TOKEN_KEY) ?? '';
    }

    setToken(token: string):void{
        localStorage.setItem(this.TOKEN_KEY,token);
    }
    removeToken():void{
        localStorage.removeItem(this.TOKEN_KEY);
    }

    getUserId():number{
        let token = localStorage.getItem(this.TOKEN_KEY);
        if(!token){
            return -1;
        }
        let userObject = this.jwtHelperService.decodeToken(token);
        return 'user_id' in userObject ? parseInt(userObject['user_id']):-1;
    }
    isTokenExpired():boolean{
        let token = this.getToken();
        if(token==null){
            return false;
        }
        return this.jwtHelperService.isTokenExpired(token);
    }

}