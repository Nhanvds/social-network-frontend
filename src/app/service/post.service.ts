import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { HttpUtilService } from "./http.util.service";
import { Observable } from "rxjs";
import { PostDTO } from "../dto/post.dto";


@Injectable({
    providedIn:'root'
})
export class PostService{

    private apiPost = `${environment.apiBaseUrl}/posts`;
    private apiNewFeed = `${environment.apiBaseUrl}/posts/news-feed`;
    private apiMyPosts=`${environment.apiBaseUrl}/posts/my-posts`;
    private apiMyLikedPosts=`${environment.apiBaseUrl}/posts/liked-posts`;
    private apiCreatePost= `${environment.apiBaseUrl}/posts`;



    private apiConfig = {
        headers: this.httpUtilService.createHeader()
    }

    constructor(
        private http: HttpClient,
        private httpUtilService: HttpUtilService
    ){ }
    createParams(page:number,limit:number){
        return new HttpParams()
        .set('page',page)
        .set('limit',limit);
    }
    getNewFeed(page:number, limit:number):Observable<any>{
        let params = this.createParams(page,limit);
        return this.http.get(this.apiNewFeed,{params});
    }
    getMyPosts(page:number, limit:number):Observable<any>{
        let params = this.createParams(page,limit);
        return this.http.get(this.apiMyPosts,{params});
    }
    getMyLinkedPosts(page:number,limit:number):Observable<any>{
        let params = this.createParams(page,limit);
        return this.http.get(this.apiMyLikedPosts,{params});
    }
    deletePost(postId:number):Observable<any>{

        return this.http.delete(`${this.apiPost}/${postId}`);
    }
    createPost(postDto:PostDTO):Observable<any>{
        return this.http.post(`${this.apiCreatePost}`,postDto,this.apiConfig);
    }

}