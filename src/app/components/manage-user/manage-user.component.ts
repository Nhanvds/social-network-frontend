import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { PageFilter } from 'src/app/dto/pagefilter.dto';
import { UserFilter } from 'src/app/dto/userfilter.dto';
import { Role } from 'src/app/model/role';
import { UserDetail } from 'src/app/model/userdetail';
import { ApiResponse } from 'src/app/response/api.response';
import { TokenService } from 'src/app/service/token.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent implements OnInit{
 
  pageSize:number=10;
  pageNumber:number=0;
  commonSearch:string='';
  sortProperty:string='id';
  sortOrder:boolean=true;
  totalElements:number=0;
  listUsers?:UserDetail[];

  userId?:number;
  userName:string='';
  email:string='';
  role:string ='USER';
  createdTimeFrom:string='';
  createdTimeTo:string='';
  isLocked:boolean=false;

  

  constructor(
    private userService:UserService,
    private tokenService: TokenService
  ){}

  
  ngOnInit(): void {
    this.searchUsers();
  }

  searchUsers(){
    const userFilter:UserFilter={
      id:this.userId||0,
      email:this.email,
      userName:this.userName,
      isLocked:this.isLocked,
      createdFrom:this.createdTimeFrom?new Date(this.createdTimeFrom).toISOString():this.createdTimeFrom,
      createdTo:this.createdTimeTo?new Date(this.createdTimeTo).toISOString():this.createdTimeTo,
      role:this.role
    }
    const pageFilter:PageFilter<UserFilter>={
      pageNumber:this.pageNumber,
      pageSize:this.pageSize,
      filter:userFilter,
      common:this.commonSearch,
      sortProperty:this.sortProperty,
      asc:this.sortOrder
    }
    this.userService.searchUser(pageFilter).subscribe({
      next:(res:ApiResponse)=>{
        if(res.success){
          this.listUsers = res.data.content;
          this.totalElements=res.data.totalElements
          console.log(this.listUsers)
        }else{
          alert(res.message)
        }
      },
      complete:()=>{
        
      },
      error:(error)=>{
        alert(error.message)
      }
    })
  }

  saveChange(user:UserDetail){
    this.userService.updateUser(user).subscribe({
      next:(res:ApiResponse)=>{
        if(res.success){
          this.searchUsers();
        }else{
          alert(res.message);
        }
      },
      complete:()=>{

      },
      error:(error)=>{
        alert(error.message)
      }
    })
  }
  hasRole(user: UserDetail, roleName: string): boolean {
    return user.roles.some(role => role.roleName === roleName);
  }
  toggleRole(user: UserDetail, role: Role): void {
    const index = user.roles.findIndex(r => r.id === role.id);
    if (index === -1) {
      user.roles.push(role);
    } else {
      user.roles.splice(index, 1);
    }
  }
  onPageChange(event:PageEvent){
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex;
    this.searchUsers();
  }
}
