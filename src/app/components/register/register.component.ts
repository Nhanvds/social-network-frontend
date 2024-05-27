import { Component, Input,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserDTO } from 'src/app/dto/user.dto';
import { ApiResponse } from 'src/app/response/api.response';
import { Token } from 'src/app/model/token';
import { UserDetail } from 'src/app/model/userdetail';
import { TokenService } from 'src/app/service/token.service';
import { UserService } from 'src/app/service/user.service';
import { environment } from 'src/environments/environment';
import { NgToastService } from 'ng-angular-popup';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  @ViewChild('registerForm') registerForm!: NgForm;

  email: string = '';
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  userDetail?: UserDetail;
  token?: Token;
  verificationToken: string = '';
  message: string = '';
  isRegister: boolean=false;
  isVerify: boolean=false;
  errorMessage: string = '';
  canSendMail: boolean = true;

  constructor(
    private userService: UserService,
    private router: Router,
    private tokenService: TokenService,
    private toastService: NgToastService
  ) {
    this.isRegister = false,
      this.isVerify = true
  }

  register() {
    if (this.password != this.confirmPassword) {
      this.errorMessage = "Mật khẩu không khớp";
      return;
    }
    const user: UserDTO = {
      email: this.email,
      username: this.username,
      password: this.password,
      urlAvatar: environment.urlAvatarDefault
    }
    debugger
    this.userService.register(user).subscribe({
      next: (response: ApiResponse) => {
        if (response.success) {
          this.userDetail = response.data;
          // debugger
          this.isVerify = false;
          this.isRegister = true;
          if (this.userDetail) {
            this.userService.sendMail(this.userDetail.email).subscribe({
              next: (response: ApiResponse) => {
                if (response.success) {
                  this.canSendMail = false;
                  this.errorMessage='';
                  setTimeout(() => {
                    this.canSendMail = true;
                  }, 1000 * 60);

                } else {
                  this.errorMessage = response.message;
                }
              }
            })
          }
        } else {
          this.errorMessage = response.message;
        }

      }
      ,
      complete: () => {

      },
      error: (error) => {
        alert(error.error.message)
      }
    })
  }

  sendEmail() {
    if (this.userDetail) {
      this.userService.sendMail(this.userDetail.email).subscribe({
        next: (response: ApiResponse) => {
          if (response.success) {
            this.canSendMail = false;
            setTimeout(() => {
              this.canSendMail = true;
            }, 1000 * 60);
          } else {
            this.errorMessage = response.message;
          }
        }
      })
    }
  }
  verify() {
    if (this.userDetail) {
      this.userService.verify(this.verificationToken, this.userDetail?.id).subscribe({
        next: (response: ApiResponse) => {
          if (response.success) {
            this.toastService.success(
              {detail:"SUCCESS"
                ,summary:"Xác thực tài khoản thành công"
                ,duration:3000
              }
            );
            this.router.navigate(['/login'])
          } else {
            this.message = response.message;
          }
        },
        complete: () => {

        },
        error: (error) => {
          alert(error.error.message)
        }
      })
    } else {
      this.errorMessage = "Xác nhận tài khoản thất bại";
    }
  }


  checkPasswordsMatch() {    
    if (this.password !== this.confirmPassword) {
      this.registerForm.form.controls['confirmPassword']
            .setErrors({ 'passwordMismatch': true });
    } else {
      this.registerForm.form.controls['confirmPassword'].setErrors(null);
    }
  }
}
