import { Component, Input, OnInit } from '@angular/core';
import { TokenService } from 'src/app/service/token.service';
import { UserService } from 'src/app/service/user.service';
import { Router } from '@angular/router';
import { UserDetail } from 'src/app/model/userdetail';
import { ApiResponse } from 'src/app/response/api.response';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  isLoggedIn: boolean = false;
  userDetail?:UserDetail;
  
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
    this.userService.update$.subscribe(()=>{
      this.getUserDetail();
    })
      this.getUserDetail();
  }
  getUserDetail(){
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
