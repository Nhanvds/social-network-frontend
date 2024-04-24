import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { Router } from '@angular/router';
import { PostService } from 'src/app/service/post.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{

  constructor(
    private router:Router,
    private postService: PostService
  ){
    
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  
}
