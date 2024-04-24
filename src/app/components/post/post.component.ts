import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from 'src/app/service/post.service';
import { TokenService } from 'src/app/service/token.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit{



  constructor(
    private postService:PostService,
    private router:Router,
    private userSevice: UserService,
    private tokenService: TokenService
  ){

  }
  ngOnInit(): void {
    const userId = this.tokenService.getUserId();
    
  }

}
