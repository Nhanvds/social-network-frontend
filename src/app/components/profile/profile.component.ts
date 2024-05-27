import { Component, Input, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { NgConfirmService } from 'ng-confirm-box';
import { CommentDto } from 'src/app/dto/comment.dto';
import { PostDTO } from 'src/app/dto/post.dto';
import { PostReactionDto } from 'src/app/dto/reaction.dto';
import { PostPrivacy } from 'src/app/model/postprivacy';
import { UserDetail } from 'src/app/model/userdetail';
import { ApiResponse } from 'src/app/response/api.response';
import { CommentResponse } from 'src/app/response/comment.response';
import { PostResponse } from 'src/app/response/post.response';
import { CommentService } from 'src/app/service/comment.service';
import { PostService } from 'src/app/service/post.service';
import { TokenService } from 'src/app/service/token.service';
import { UserService } from 'src/app/service/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{
  @Input() page?: string;

  urlAvatarDefault=environment.urlAvatarDefault;

  userDetail?:UserDetail;

  myUserId:number=0;
  errorMessage: string = '';
  isUploadFile: boolean = false;
  isLoadPosts: boolean = false;
  postPrivacies: PostPrivacy[]=[];
  postPrivacyId: number = 2;
  postDto?: PostDTO;
  content:string='';
  urlImages: string[]=[];
  selectedImages?: FileList;
  postsResponse: PostResponse[]=[];

  userId:number=0;
  //post
  hasLiked: boolean= false;
  pageNumber: number = 0;
  pageSize: number = 10;
  commonSearch: string = '';
  asc: boolean = false;
  totalPosts:number=0;


  //comment
  pageNumberComment:number=0;
  pageSizeComment:number=5;
  ascSortComments:boolean=false;
  loadComment:boolean=false;
  inputCreateComment:string="";
  listComments:CommentResponse[]=[];
  totalComments:number=0;



  constructor(
    private postService: PostService,
    private commentService: CommentService,
    private userSevice: UserService,
    private tokenService: TokenService,
    private activatedRoute: ActivatedRoute,
    private confirmService: NgConfirmService,
    private toastService: NgToastService,
    private router:Router
  ) {

  }
  ngOnInit(): void {
    this.myUserId = this.tokenService.getUserId();
    this.activatedRoute.paramMap.subscribe(paramMap => {
      const userId = paramMap.get('userId') || "0";
      this.userId = parseInt(userId, 10);
      this.getUserDetailById(this.userId);
      this.getPostsByUserId();
    });
  }
  getPostsByUserId() {
    this.postService.getPostsByUserId(this.userId,this.pageNumber,this.pageSize,this.asc,this.commonSearch,this.hasLiked).subscribe({
      next:(res:ApiResponse)=>{
        if(res.success){
          this.postsResponse= res.data.content;
          this.totalPosts=res.data.totalElements;
        }else{
          alert(res.message)
        }
      }
    })
  }
  getUserDetailById(userId:number){
    if(userId!=undefined){
      this.userSevice.getInfoUser(userId).subscribe({
        next:(res:ApiResponse)=>{
          if(res.success){
            this.userDetail= res.data;
          }else{
            alert(res.message);
          }
        }
      })
    }
  }
  openFormCreatePost() {
    this.postService.getAllPostPrivacyStatus().subscribe({
      next: (response: ApiResponse) => {
        if (response.success) {
          this.postPrivacies = response.data;
        } else {
          this.errorMessage = response.message;
          alert(this.errorMessage);
        }
      },
      error:(error)=>{
        this.toastService.error(
          {detail:"ERROR"
            ,summary:error.message
            ,duration:3000
          }
        );
      }
    })
  }
  onImageSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files && inputElement.files.length > 0 && inputElement.files.length <= 5) {
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

            this.urlImages = response.data;
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
  

  createPost() {
    const postDto: PostDTO = {
      content: this.normalizeContent(this.content),
      postPrivacyStatusId: this.postPrivacyId,
      urlPostImages: this.urlImages
    }
    debugger
    this.postService.createPost(postDto).subscribe({
      next: (response: ApiResponse) => {
        if (response.success) {
          this.getPostsByUserId();
          this.toastService.success(
            {detail:"SUCCESS"
              ,summary:"Tạo bài viết thành công"
              ,duration:3000
            }
          );
        } else {
          this.toastService.error(
            {detail:"ERROR"
              ,summary:response.message
              ,duration:3000
            }
          );
        }
      },
      complete:()=>{
        document.getElementById('close-modal-create-post')?.click();
      }
    })
  }
  deletePost(postId:number,detail:boolean){
    if(detail==true){
      document.getElementById('close-modal-detail-post'+postId)?.click();
    }
    this.confirmService.showConfirm("Xoá bài viết?",
    ()=>{
      this.postService.deletePost(postId).subscribe({
        next:(res:ApiResponse)=>{
          if(res.success){
            this.getPostsByUserId();
            this.toastService.success(
              {detail:"SUCCESS"
                ,summary:"Xoá bài viết thành công"
                ,duration:3000
              }
            );
          }else{
            alert(res.message)
          }
        }
      })
    },
    ()=>{})
      
    
  }
  viewProfile(userId:number,postId:number){
    document.getElementById('close-modal-detail-post'+postId)?.click();
    this.router.navigate(['posts/',userId]);
  }
  editPost(post:PostResponse){

    const postDto:PostDTO={
      content:this.normalizeContent(post.content),
      postPrivacyName:post.postPrivacyStatus
    }
    this.postService.updatePost(post.id,postDto)
    .subscribe({
      next:(res:ApiResponse)=>{
        if(res.success){
          this.getPostsByUserId();
          this.toastService.success(
            {detail:"SUCCESS"
              ,summary:"Cập nhật bài viết thành công"
              ,duration:3000
            }
          );
          
        }
      },
      complete:()=>{
        document.getElementById('close-modal-edit-post'+post.id)?.click();
        
      }
    })
  }

  like(postId:number,hasLiked:boolean,hasDisLiked:boolean){
    
    let reactDto:PostReactionDto= {
        userId: this.myUserId,
        postId: postId,
        hasLiked: true
      }
    this.postService.createReaction(reactDto).subscribe({
      next:(res:ApiResponse)=>{
        if(res.success){
          this.postsResponse?.forEach(p=>{
            if(p.id==postId){
              if(hasLiked==true){
                p.hasLiked=false;
                p.likedReactions--;
              }else{
                p.hasLiked=true;
                p.likedReactions++;
                if(p.hasDisLiked==true){
                  p.hasDisLiked=false;
                  p.dislikedReactions--;
                }
              }
      
            }
          })


        }else{
          alert(res.message)
        }
      },
      complete:()=>{

      },
      error:(e)=>{
        alert(e);
      }
    })

  }
  dislike(postId:number,hasLiked:boolean,hasDisLiked:boolean){
    
    let reactDto:PostReactionDto= {
      userId: this.myUserId,
      postId: postId,
      hasLiked: false
    }
    this.postService.createReaction(reactDto).subscribe({
      next:(res:ApiResponse)=>{
        if(res.success){
          this.postsResponse?.forEach(p=>{
            if(p.id==postId){
              if(hasDisLiked==true){
                p.hasDisLiked=false;
                p.dislikedReactions--;
              }else{
                p.hasDisLiked=true;
                p.dislikedReactions++;
                if(p.hasLiked==true){
                  p.hasLiked=false;
                  p.likedReactions--;
                }
      
              }
      
            }
          })
        }else{
          alert(res.message)
        }

      }
    })

  }

  getTime(time: any): string {
    let thoiGianHienTai = new Date();
    let createTime = new Date(time);
    let khoangThoiGian = thoiGianHienTai.getTime() - createTime.getTime();
    let soPhut = Math.round(khoangThoiGian / (1000 * 60));

    if (soPhut < 60) {
      return soPhut + " phút";
    }

    let soGio = Math.round(soPhut / 60);
    if (soGio < 24) {
      return soGio + " giờ";
    }

    let soNgay = Math.round(soGio / 24);

    if (soNgay > 30) {
      let ngay = createTime.getDate();
      let thang = createTime.getMonth() + 1;
      let nam = createTime.getFullYear();
      return ngay + "/" + thang + "/" + nam;
    }

    return soNgay + " ngày";
  }

  createComment(postId:number){
    let commentDto:CommentDto={
      postId:postId,
      content:this.inputCreateComment
    }
    this.commentService.createComment(commentDto).subscribe({
      next:(response:ApiResponse)=>{
        if(response.success){
          this.inputCreateComment='';
          let createdComment= response.data;
          this.listComments?.push(createdComment);
        }else{
          alert(response.message)
        }
      }
    })
  }
  deleteComment(commentId:number,postId:number){
    this.commentService.deleteComment(commentId).subscribe({
      next:(response:ApiResponse)=>{
        if(response.success){
          this.inputCreateComment="";
          this.getComments(postId);
        }else{
          alert(response.message);
        }
      },
      complete:()=>{

      },
      error:(error)=>{
        alert(error.message)
      }
    })
  }
  getComments(postId:number){
    console.log(this.ascSortComments)
    this.loadComment=true;
    this.commentService.getComments(postId,this.pageNumberComment,this.pageSizeComment,this.ascSortComments).subscribe({
      
      next:(response:ApiResponse)=>{
        if(response.success){
          this.listComments=response.data.content;
          this.totalComments=response.data.totalElements;
        }else{
          alert(response.message);
        }
      },
      complete:()=>{
        this.loadComment=false;
      },
      error:(error)=>{
        alert(error.message)
      }

    })

  }
  onPagePostChange(event: PageEvent){
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getPostsByUserId();
  }
  onPageCommentChange(event: PageEvent,postId:number){
    this.pageNumberComment = event.pageIndex;
    this.pageSizeComment = event.pageSize;
    this.getComments(postId);
  }

  normalizeContent(content:string):string {
    return content.replace(/\s*\n\s*/g, '\n').trim();
  }

}
