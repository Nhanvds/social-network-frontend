import { UserCard } from "../model/usercard";

export interface CommentResponse{
    id:number,
    content:string,
    user:UserCard,
    createdTime:Date
}