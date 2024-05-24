import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { HttpUtilService } from "./http.util.service";
import { Observable } from "rxjs";
import { PostDTO } from "../dto/post.dto";
import { PostFilterDTO } from "../dto/postfilter.dto";
import { PageFilter } from "../dto/pagefilter.dto";
import { PostReactionDto } from "../dto/reaction.dto";


@Injectable({
    providedIn:'root'
})
export class PostService{

    private apiPost = `${environment.apiBaseUrl}/posts`;
    private apiPostsInHome = `${environment.apiBaseUrl}/posts/list`;
    private apiPostsByUserId = `${environment.apiBaseUrl}/posts/list`;
    private apiCreatePost= `${environment.apiBaseUrl}/posts`;
    private apiGetPostPrivacyStatus= `${environment.apiBaseUrl}/posts/post-privacy`;
    private apiPostImages=`${environment.apiBaseUrl}/post-images`;
    private apiSearchPost=`${environment.apiBaseUrl}/posts/list`;
    private apiReaction= `${environment.apiBaseUrl}/posts/like`;



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
    getAllPostPrivacyStatus():Observable<any>{

        return this.http.get(this.apiGetPostPrivacyStatus);
    }
    getPostPrivacyStatusById(id:number):Observable<any>{

        return this.http.get(`${this.apiGetPostPrivacyStatus}/id`);
    }
    
    deletePost(postId:number):Observable<any>{

        return this.http.delete(`${this.apiPost}/${postId}`);
    }
    createPost(postDto:PostDTO):Observable<any>{
        return this.http.post(`${this.apiCreatePost}`,postDto,this.apiConfig);
    }
    uploadFiles(files:FileList):Observable<any>{
        let formdata:FormData=new FormData();
        for(let i=0;i<files.length;i++){
            formdata.append('files',files[i]);
        }
        return this.http.post(this.apiPostImages,formdata);
    }
    searchPosts(pageFilterDto:PageFilter<PostFilterDTO>):Observable<any>{
        return this.http.post(this.apiSearchPost,pageFilterDto,this.apiConfig);
    }
    getPostsInHome(page:number,limit:number,asc:boolean,common:string,hasLiked:boolean):Observable<any>{
        const params = new HttpParams()
        .set('page',page)
        .set('limit',limit)
        .set('asc',asc)
        .set('common',common)
        .set('hasLiked',hasLiked);
        return this.http.get(this.apiPostsInHome,{params});
    }
    getPostsByUserId(userId:number,page:number,limit:number,asc:boolean,common:string,hasLiked:boolean):Observable<any>{
        const params = new HttpParams()
        .set('page',page)
        .set('limit',limit)
        .set('userId',userId)
        .set('asc',asc)
        .set('common',common)
        .set('hasLiked',hasLiked)
        return this.http.get(`${this.apiPostsByUserId}/${userId}`,{params});
    }
    lockPost(id:number,isLocked:boolean):Observable<any>{
        return this.http.put(`${environment.apiBaseUrl}/posts/${id}/lock`,isLocked,this.apiConfig);
    }
    createReaction(reationDto: PostReactionDto):Observable<any>{
        return this.http.post(this.apiReaction,reationDto,this.apiConfig);
    }
    deleteReaction(postId:number):Observable<any>{
        return this.http.delete(`${this.apiReaction}/${postId}`,this.apiConfig);
    }


}