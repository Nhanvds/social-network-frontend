import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {HttpUtilService} from "./http.util.service"
import { UserDTO } from "../dto/user.dto";
import { Observable } from "rxjs";
import { UserDetail } from "../model/userdetail";

@Injectable({
    providedIn:'root'
})
export class UserService{
    private apiLogin = `${environment.apiBaseUrl}/users/login`;
    private apiRegister = `${environment.apiBaseUrl}/users/register`;
    private apiSendMail = `${environment.apiBaseUrl}/users/send`;
    private apiVerify = `${environment.apiBaseUrl}/users/verification`;
    private apiUserDetail=`${environment.apiBaseUrl}/users`;

    private apiConfig = {
        headers: this.httpUtilService.createHeader()
    }

    constructor(
        private http: HttpClient,
        private httpUtilService: HttpUtilService
    ){ }

    getUserDetail():Observable<any>{

        return this.http.get(this.apiUserDetail);
    }
    saveUserDetailToLocalStorage(userDetail?:UserDetail){
        try{
            if(userDetail==null|| !userDetail){
                return;
            }
            const userDetailJson= JSON.stringify(userDetail);
            localStorage.setItem('user',userDetailJson);
        }catch (error) {
            console.error('Error saving user response to local storage:', error);
          }
    }
    removeUserDetailToLocalStorage(){
        localStorage.removeItem('user');
    }
    login(userDTO:UserDTO):Observable<any>{
        return this.http.post(this.apiLogin,userDTO,this.apiConfig);
    }
    register(userDTO:UserDTO):Observable<any>{
        return this.http.post(this.apiRegister,userDTO,this.apiConfig);
    }
    sendMail(email:string):Observable<any>{
        let params = new HttpParams().set('email', email); 
        return this.http.post(this.apiSendMail,null,{params:params});
    }
    verify(token:string,userId:number):Observable<any>{
        const params = new HttpParams()
        .set('verification-token',token)
        .set('id',userId);
        return this.http.post(this.apiVerify,null,{params:params})
    }
    

}