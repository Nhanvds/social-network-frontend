import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ToastrService } from 'ngx-toastr';
import { UserDTO } from 'src/app/dto/user.dto';
import { UserDetail } from 'src/app/model/userdetail';
import { ApiResponse } from 'src/app/response/api.response';
import { PostService } from 'src/app/service/post.service';
import { TokenService } from 'src/app/service/token.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-update-info',
  templateUrl: './update-info.component.html',
  styleUrls: ['./update-info.component.scss']
})
export class UpdateInfoComponent implements OnInit{

  step: number = 1;
  password: string = '';
  checkPasswordMessage:string='';

  errorMessage:string='';
  userDetail?:UserDetail;
  urlImages: string[]=[];
  selectedImages?: FileList;

  isUploadFile: boolean = false;
  isLoadPosts: boolean = false;

  username:string = '';
  description: string = '';
  urlAvatar:string= '';
  newPassword:string='';
  confirmPassword:string='';


  constructor(
    private userService:UserService,
    private postService: PostService,
    private tokenService: TokenService,
    private router: Router,
    private toastService: NgToastService,
  ){
  }
  ngOnInit(): void {
    this.getUserDetail();
  }

  getUserDetail(){
    this.userService.getUserDetail().subscribe({
      next:(res:ApiResponse)=>{
        if(res.success){
          this.userDetail=res.data;
          this.username=res.data.username;
          this.description=res.data.description;
          this.urlAvatar=res.data.urlAvatar;
        }else{
          this.errorMessage=res.message;
        }
      },
      error:(error)=>{
        alert(error);
      }
    })
  }

  verifyPassword() {
    const userId:number = this.tokenService.getUserId();
    if(this.password!=''){
      console.log(this.password)
      this.userService.checkPassword(userId,this.password).subscribe({
        next:(res:ApiResponse)=>{
          if(res.success){
            this.step=2;
          }else{
            this.checkPasswordMessage=res.message;
          }
        },
        error:(error)=>{
          alert(error.message);
        }
      })
    }
    
    
  }

  updateAccount() {
    if(this.newPassword!=''&&this.confirmPassword!=''){
      if(this.newPassword!=this.confirmPassword){
        this.errorMessage='Mật khẩu không khớp';
        return;
      }
    }
    this.userService.updateInfo(this.userDetail?.id,
      {
        email:this.userDetail?.email,
        username:this.username,
        password:this.newPassword,
        urlAvatar:this.urlAvatar,
        description: this.description
      }
    ).subscribe({
      next:(res:ApiResponse)=>{
        if(res.success){
          this.getUserDetail();
          const userDTO: UserDTO = {
            email: this.userDetail?.email||'',
            username: this.username,
            password: this.newPassword
          }
          this.userService.login(userDTO).subscribe({
            next:(res:ApiResponse)=>{
              if(res.success){
                const { token } = res.data;
                this.tokenService.setToken(token);
              }
            }
          })
          this.router.navigate(['posts/'+this.userDetail?.id]);
          this.toastService.success(
            {detail:"SUCCESS"
              ,summary:"Cập nhật thông tin tài khoản thành công"
              ,duration:3000
            }
          );
          this.userService.requestUpdate();
          
        }
        else{
          this.toastService.error(
            {detail:"ERROR"
              ,summary:"Cập nhật thông tin tài khoản thất bại"
              ,duration:3000
            }
          );
        }
      }
    })
  }
  onImageSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files && inputElement.files.length > 0 && inputElement.files.length == 1) {
      this.selectedImages = inputElement.files;
    } else {
      this.errorMessage = "Tải lên tối đa 5 ảnh";
    }
  }
  uploadFile() {
    this.isUploadFile = true;
    if (this.selectedImages) {
      this.postService.uploadFiles(this.selectedImages).subscribe({
        next: (response: ApiResponse) => {
          if (response.success) {

            this.urlAvatar = response.data[0];
          } else {
            this.errorMessage = response.message;
          }
        },
        complete: () => {
          this.isUploadFile = false;
        }
      })
    }

  }

}
