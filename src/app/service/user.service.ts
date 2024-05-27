import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { HttpUtilService } from "./http.util.service"
import { UserDTO } from "../dto/user.dto";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { UserDetail } from "../model/userdetail";
import { UserFilter } from "../dto/userfilter.dto";
import { PageFilter } from "../dto/pagefilter.dto";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private loggedIn = new BehaviorSubject<boolean>(false);
    private updateSubject = new Subject<void>();
    private apiLogin = `${environment.apiBaseUrl}/users/login`;
    private apiRegister = `${environment.apiBaseUrl}/users/register`;
    private apiSendMail = `${environment.apiBaseUrl}/users/send`;
    private apiVerify = `${environment.apiBaseUrl}/users/verification`;
    private apiUserDetail = `${environment.apiBaseUrl}/users`;
    private apiSearchUser = `${environment.apiBaseUrl}/users/search`;
    private apiGetAll = `${environment.apiBaseUrl}/users/list`;
    private apiUpdateUser = `${environment.apiBaseUrl}/users`;

    private apiConfig = {
        headers: this.httpUtilService.createHeader()
    }

    constructor(
        private http: HttpClient,
        private httpUtilService: HttpUtilService
    ) { }

    getUserDetail(): Observable<any> {
        return this.http.get(this.apiUserDetail);
    }
    getInfoUser(userId: number): Observable<any> {
        return this.http.get(`${this.apiUserDetail}/${userId}/detail`, this.apiConfig);
    }

    saveUserDetailToLocalStorage(userDetail?: UserDetail) {
        try {
            if (userDetail == null || !userDetail) {
                return;
            }
            const userDetailJson = JSON.stringify(userDetail);
            localStorage.setItem('user', userDetailJson);
        } catch (error) {
            console.error('Error saving user response to local storage:', error);
        }
    }
    removeUserDetailToLocalStorage() {
        localStorage.removeItem('user');
    }
    login(userDTO: UserDTO): Observable<any> {
        return this.http.post(this.apiLogin, userDTO, this.apiConfig);
    }
    register(userDTO: UserDTO): Observable<any> {
        return this.http.post(this.apiRegister, userDTO, this.apiConfig);
    }
    sendMail(email: string): Observable<any> {
        let params = new HttpParams().set('email', email);
        return this.http.post(this.apiSendMail, null, { params: params });
    }
    verify(token: string, userId: number): Observable<any> {
        const params = new HttpParams()
            .set('verification-token', token)
            .set('id', userId);
        return this.http.post(this.apiVerify, null, { params: params })
    }
    getAllUsers(pageNumber: number, pageLimit: number, commonSearch: string, asc: boolean, sortProperty: string)
        : Observable<any> {
        const params = new HttpParams()
            .set('page', pageNumber)
            .set('limit', pageLimit)
            .set('common', commonSearch)
            .set('asc', asc)
            .set('sortProperty', sortProperty);
        return this.http.get(this.apiGetAll, {
            params: params,
            headers: this.apiConfig.headers
        });

    }
    searchUser(pageFilter: PageFilter<UserFilter>): Observable<any> {
        return this.http.post(this.apiSearchUser, pageFilter, this.apiConfig);
    }
    checkPassword(userId: number, password: string): Observable<any> {
        return this.http.post(`${this.apiUpdateUser}/${userId}/check/password`, password, this.apiConfig);
    }
    updateInfo(userId?: number, data?: any): Observable<any> {
        return this.http.put(`${this.apiUpdateUser}/${userId}/update`, data, this.apiConfig);
    }
    updatePassword(token:string, data?: any): Observable<any> {
        return this.http.put(`${this.apiUpdateUser}/${token}/update-password`, data, this.apiConfig);
    }
    updateUser(userDetail: UserDetail): Observable<any> {
        return this.http.put(this.apiUpdateUser, userDetail, this.apiConfig);
    }
    getUserByEmail(email:string):Observable<any>{
        return this.http.get(`${this.apiUserDetail}/${email}/email`,this.apiConfig);
    }

    setLogin(): void {
        this.loggedIn.next(true);
    }

    setLogout(): void {
        this.loggedIn.next(false);
    }
    get isLoggedIn(): Observable<boolean> {
        return this.loggedIn.asObservable();
    }
    get update$() {
        return this.updateSubject.asObservable();
    }

    requestUpdate() {
        this.updateSubject.next();
    }


}