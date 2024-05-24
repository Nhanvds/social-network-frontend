
export interface PostFilterDTO{
    id:number,
    content:string,
    userId:number,
    isLocked:boolean,
    createdTimeFrom:string,
    createdTimeTo:string,
    postPrivacy:boolean
}