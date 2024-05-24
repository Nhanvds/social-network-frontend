import { Role } from "./role";
export interface UserDetail{
    id:number,

    email:string,

    username:string,

    urlAvatar:string,

    description:string,

    isLocked:boolean,

    createdAt:Date,

    roles:Role[]
}