import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpUtilService } from './http.util.service';
import { environment } from 'src/environments/environment';
import { CommentDto } from '../dto/comment.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private apiComment = `${environment.apiBaseUrl}/comments`;


  constructor(
    private http: HttpClient,
    private httpUtilService: HttpUtilService
  ) { }
  private apiConfig = {
    headers: this.httpUtilService.createHeader()
  }

  createComment(commentDto:CommentDto):Observable<any>{
    return this.http.post(this.apiComment,commentDto,this.apiConfig);
  }
  deleteComment(commentId:number):Observable<any>{
    return this.http.delete(`${this.apiComment}/${commentId}`,this.apiConfig);
  }
  getComments(postId:number,page:number,limit:number,asc:boolean):Observable<any>{
    const params = new HttpParams()
    .set('page',page)
    .set('limit',limit)
    .set('asc',asc);
    return this.http.get(`${this.apiComment}/${postId}`,{params:params});
  }
}
