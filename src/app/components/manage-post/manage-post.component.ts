import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { PageFilter } from 'src/app/dto/pagefilter.dto';
import { PostFilterDTO } from 'src/app/dto/postfilter.dto';
import { ApiResponse } from 'src/app/response/api.response';
import { PostResponse } from 'src/app/response/post.response';
import { PostService } from 'src/app/service/post.service';

@Component({
  selector: 'app-manage-post',
  templateUrl: './manage-post.component.html',
  styleUrls: ['./manage-post.component.scss']
})
export class ManagePostComponent implements OnInit {

  postId: number = 0;
  userId: number = 0;
  content: string = '';
  createdTimeFrom: string = '';
  createdTimeTo: string = '';
  isLocked: boolean = false;
  privacyPost: boolean = true;

  pageSize: number = 2;
  pageNumber: number = 0;
  commonSearch: string = '';
  sortProperty: string = 'createdAt';
  asc: boolean = false;

  totalPages:number=0;
  totalElements:number=0;


  postList: PostResponse[] = [];

  ngOnInit(): void {
    this.searchPosts();
  }
  constructor(
    private postService: PostService
  ) {
  }

  searchPosts() {
    const postFilter: PostFilterDTO = {
      id: this.postId,
      content: this.content,
      userId: this.userId,
      isLocked: this.isLocked,
      createdTimeFrom: this.createdTimeFrom?new Date(this.createdTimeFrom).toISOString():this.createdTimeFrom,
      createdTimeTo: this.createdTimeTo?new Date(this.createdTimeTo).toISOString():this.createdTimeTo,
      postPrivacy: this.privacyPost
    }
    const pageFilter:PageFilter<PostFilterDTO>={
      pageNumber:this.pageNumber,
      pageSize:this.pageSize,
      filter:postFilter,
      common:this.commonSearch,
      sortProperty:this.sortProperty,
      asc:this.asc
    }
    this.postService.searchPosts(pageFilter).subscribe({
      next:(res:ApiResponse)=>{
        if(res.success){
          this.postList=res.data.content
          this.totalElements=res.data.totalElements
          console.log(this.postList)
        }else{
          alert(res.message)
        }
      },
      complete:()=>{

      },
      error:(error)=>{
        alert(error.message)
      }
      }
    )
  }

  saveChange(postId:number,isLocked:boolean){
    this.postService.lockPost(postId,isLocked).subscribe({
      next:(res:ApiResponse)=>{
        if(res.success){
          
        }else{
          alert(res.message);
        }
      },
      complete:()=>{
        this.searchPosts();
      },
      error:(error)=>{
        alert(error.manage)
      }
    })
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex;
    this.searchPosts();
  }
}
