import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserDetail } from 'src/app/model/userdetail';
import { ApiResponse } from 'src/app/response/api.response';
import { TokenService } from 'src/app/service/token.service';
import { UserService } from 'src/app/service/user.service';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit{

  isLoggedIn: boolean = false;
  userDetail?:UserDetail;
  isPopoverOpen = false;
  activeNavItem: number = 0;
  
  constructor (
    private userService:UserService,
    private tokenService: TokenService,
    private router: Router
  ){


  }
  ngOnInit(): void {
    this.userService.isLoggedIn.subscribe(status => {
      this.isLoggedIn = status;
    });
    const userId:number = this.tokenService.getUserId();
    this.userService.getUserDetail().subscribe({
      next:(response:ApiResponse)=>{
        if(response.success){
          this.userDetail={...response.data}
          this.isLoggedIn=true;
        }else{
          this.router.navigate(["/login"])
        }
      }
    })
  }
  logout(){
    this.tokenService.removeToken();
    this.userService.removeUserDetailToLocalStorage();
    this.userService.setLogout();
    this.router.navigate(['/login']);
  }
  


}
