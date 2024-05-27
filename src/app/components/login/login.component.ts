import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserDTO } from 'src/app/dto/user.dto';
import { UserDetail } from 'src/app/model/userdetail';
import { TokenService } from 'src/app/service/token.service';
import { UserService } from 'src/app/service/user.service';
import { ApiResponse } from 'src/app/response/api.response';
import { BehaviorSubject } from 'rxjs';
import { NgForm } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('confirmPasswordForm') confirmPasswordForm!: NgForm;
  private readonly TOKEN_KEY = 'token-key';
  //verify
  step: number = 1;
  verificationToken: string = '';
  canSendMail: boolean = true;


  email: string = '';
  username: string = 'username';
  password: string = '';
  userDetail?: UserDetail;
  errorMessage: string = '';
  isVerified: boolean = true;

  confirmPassword:string='';
  constructor(
    private router: Router,
    private userService: UserService,
    private tokenService: TokenService,
    private toastService: NgToastService
  ) { }
  ngOnInit(): void {
    const isTokenExpired = this.tokenService.isTokenExpired();
    const isUserIdValid = this.tokenService.getUserId() > 0;

    // debugger
    if (!isTokenExpired && isUserIdValid) {
      this.router.navigate(["/home"]);
    } else {
      this.tokenService.removeToken();
    }
  }


  login() {
    const userDTO: UserDTO = {
      email: this.email,
      username: this.username,
      password: this.password
    }
    debugger
    this.userService.login(userDTO).subscribe({
      next: (response: ApiResponse) => {
        console.log(response)
        if (response.success == true) {
          const { token } = response.data;
          this.tokenService.setToken(token);
          this.userService.getUserDetail().subscribe({
            next: (res: ApiResponse) => {
              this.userDetail = {
                ...res.data
              };

              let roleId = 3;
              if (this.userDetail) {
                if (this.hasRole(this.userDetail, 'ADMIN')) {
                  roleId = 1;
                } else if (this.hasRole(this.userDetail, 'USER')) {
                  roleId = 2;
                }
              }
              console.log(roleId)
              if (roleId == 3) {
                this.errorMessage = 'Tài khoản chưa xác thực';
                this.step=2;
                this.isVerified = false;
                this.logout();
                this.sendEmail();
              } else if (roleId == 1) {
                this.userService.requestUpdate();
                this.userService.setLogin();
                this.router.navigate(['/admin'])
              } else {
                this.userService.requestUpdate();
                this.userService.setLogin();
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
      },
      error: (error: any) => {
        this.errorMessage = error.error.message
      }

    })
  }
  hasRole(user: UserDetail, roleName: string): boolean {
    return user.roles.some(role => role.roleName === roleName);
  }
  logout() {
    this.tokenService.removeToken();
    this.userService.removeUserDetailToLocalStorage();
    this.userService.setLogout();
    this.router.navigate(['/login']);
  }

  sendEmail() {
    if(this.step==3){
      this.getUserDetailByEmail();
    }
    this.canSendMail = false;
    this.userService.sendMail(this.email).subscribe({
      next: (response: ApiResponse) => {
        if (response.success) {
          
          setTimeout(() => {
            this.canSendMail = true;
          }, 1000 * 60);
        } else {
          this.errorMessage = response.message;
        }
      }
    })
  }

  verify() {
    if (this.userDetail) {
      this.userService.verify(this.verificationToken, this.userDetail?.id).subscribe({
        next: (response: ApiResponse) => {
          if (response.success) {
            if(this.step==2){
              this.step=1;
            }else{
              this.step=4
            }
          } else {
            this.errorMessage = response.message;
          }
        },
        complete: () => {

        },
        error: (error) => {
          alert(error.error.message)
        }
      })
    } else {
      this.errorMessage = "Xác thực tài khoản thất bại";
    }
  }
  getUserDetailByEmail(){
    this.userService.getUserByEmail(this.email).subscribe({
      next:(res:ApiResponse)=>{
        if(res.success){
          this.userDetail=res.data;
        }else{
          this.toastService.error(
            {detail:"ERROR"
              ,summary:res.message
              ,duration:3000
            }
          );
        }
      }
    })
  }

  forgotPassword(){
    this.step=3;
  }
  loginForm(){
    this.step=1;
  }

  checkPasswordsMatch() {    
    if (this.password !== this.confirmPassword) {
      this.confirmPasswordForm.form.controls['confirmPassword']
            .setErrors({ 'passwordMismatch': true });
    } else {
      this.confirmPasswordForm.form.controls['confirmPassword'].setErrors(null);
    }
  }
  updatePassword(){
    if(this.password!=this.confirmPassword){
      this.errorMessage = "Mật khẩu không khớp";
      return;
    }
    this.userService.updatePassword(this.verificationToken,
      {
        id:this.userDetail?.id,
        email:this.userDetail?.email,
        username:this.userDetail?.username,
        password:this.password,
        urlAvatar:this.userDetail?.urlAvatar,
        description: this.userDetail?.description
      }
    ).subscribe({
      next:(res:ApiResponse)=>{
        if(res.success){
          this.toastService.success(
            {detail:"SUCCESS"
              ,summary:"Cập nhật mật khẩu thành công"
              ,duration:3000
            }
          );
          this.step=1;
        }else{
          this.toastService.error(
            {detail:"ERROR"
              ,summary:res.message
              ,duration:3000
            }
          );
        }
      }
    })
  }
}
