import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserDTO } from 'src/app/dto/user.dto';
import { UserDetail } from 'src/app/model/userdetail';
import { TokenService } from 'src/app/service/token.service';
import { UserService } from 'src/app/service/user.service';
import { ApiResponse } from 'src/app/response/api.response';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent  implements OnInit{
  private readonly TOKEN_KEY = 'token-key';
  email: string = '';
  username: string = 'username';
  password: string = '';
  userDetail?: UserDetail;
  errorMessage: string = '';
  constructor(
    private router: Router,
    private userSevice: UserService,
    private tokenService: TokenService
  ) { }
  ngOnInit(): void {
    const isTokenExpired = this.tokenService.isTokenExpired();
    const isUserIdValid = this.tokenService.getUserId() >0;

    // debugger
    if(!isTokenExpired&& isUserIdValid){
      this.router.navigate(["/home"]);
    }else{
      this.tokenService.removeToken();
    }
  }
  
  register() {
    this.router.navigate(['register'])
  }
  login() {
    const userDTO: UserDTO = {
      email: this.email,
      username: this.username,
      password: this.password
    }
    debugger
    this.userSevice.login(userDTO).subscribe({
      next: (response: ApiResponse) => {
        console.log(response)
        if (response.success==true) {
          const { token } = response.data;
          this.tokenService.setToken(token);
          this.userSevice.getUserDetail().subscribe({
            next: (res: ApiResponse) => {
              this.userDetail = {
                ...res.data
              };
              
              let roleId = 3;
              if(this.userDetail){
                if(this.hasRole(this.userDetail,'ADMIN')){
                  roleId=1;
                }else if(this.hasRole(this.userDetail,'USER')){
                  roleId=2;
                }
              }
              console.log(roleId)
              if (roleId == 3) {
                this.errorMessage = 'Tài khoản chưa xác thực';
              } else if (roleId == 1) {
                this.router.navigate(['/admin'])
              } else {
                this.router.navigate(['/'])
              }

            },
            complete: () => {
            },
            error: (error: any) => {
              alert(error.error.message);
            }
          })

        } else {
          this.errorMessage = response.message;
        }

      },
      complete: () => {
        this.userSevice.setLogin();
      },
      error: (error: any) => {
        alert(error.error.message);
        this.errorMessage = error.error.message
      }

    })
  }
  hasRole(user: UserDetail, roleName: string): boolean {
    return user.roles.some(role => role.roleName === roleName);
  }

}
