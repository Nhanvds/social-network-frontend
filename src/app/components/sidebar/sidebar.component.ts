import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { PageFilter } from 'src/app/dto/pagefilter.dto';
import { UserFilter } from 'src/app/dto/userfilter.dto';
import { UserCard } from 'src/app/model/usercard';
import { ApiResponse } from 'src/app/response/api.response';
import { TokenService } from 'src/app/service/token.service';
import { UserService } from 'src/app/service/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isLoggedIn?: boolean;
  urlAvatarDefault = environment.urlAvatarDefault

  userList?: UserCard[];

  inputSearch: string = "";
  pageSize: number =5;
  pageNumber: number = 0;
  sortProperty: string = "userName";
  asc: boolean = true;
  totalElements:number=0;

  userFilter?: UserFilter;
  pageFilter?: PageFilter<UserFilter>;

  ngOnInit(): void {
    this.userService.isLoggedIn.subscribe(status => {
      this.isLoggedIn = status;
    });
    this.userService.update$.subscribe(()=>{
      this.search();
    })
    const userId: number = this.tokenService.getUserId();
    if (userId != -1) {
      this.isLoggedIn = true;
      this.search();
    }
  }

  constructor(
    private userService: UserService,
    private router: Router,
    private tokenService: TokenService
  ) {
  }
  search() {
    this.userService.getAllUsers(
      this.pageNumber, this.pageSize, this.inputSearch, this.asc, this.sortProperty
    ).subscribe({
      next: (res: ApiResponse) => {
        if (res.success) {
          
          this.userList = res.data.content;
          this.totalElements=res.data.totalElements;
        }
      },
      complete: () => {

      },
      error: (error) => {
        alert(error.message)
      }
    })
  }
  onPageChange(event:PageEvent){
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex;
    this.search();
  }

}
