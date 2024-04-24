import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserDTO } from 'src/app/dto/user.dto';
import { UserDetail } from 'src/app/model/userdetail';
import { TokenService } from 'src/app/service/token.service';
import { UserService } from 'src/app/service/user.service';
import { ApiResponse } from 'src/app/response/api.response';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent  {
  // @ViewChild('loginForm') loginForm!: NgForm;

  private readonly TOKEN_KEY = 'token-key';
  email: string = '';
  username: string = 'username';
  password: string = '';
  userDetail?: UserDetail;
  errorMessage: string = '';

  rememberMe: boolean = false;

  constructor(
    private router: Router,
    private userSevice: UserService,
    private tokenService: TokenService
  ) { }
  
  register() {
    this.router.navigate(['/users/register'])
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
              if (this.rememberMe) {
                this.userSevice.saveUserDetailToLocalStorage(this.userDetail);
              }

              let roles = this.userDetail?.roles;
              let roleId = 3;
              roles?.forEach((role) => {
                if (role.roleName == 'ADMIN') {
                  roleId = 1;
                }
                if (role.roleName == 'USER') {
                  roleId = 2;
                }
              })
              console.log(roleId)
              if (roleId == 3) {
                this.errorMessage = 'Tài khoản chưa xác thực';
              } else if (roleId == 1) {
                this.router.navigate(['/admin'])
              } else {
                this.router.navigate(['/home'])
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
      },
      error: (error: any) => {
        alert(error.error.message);
        this.errorMessage = error.error.message
      }

    })
  }

}
