
export interface PostFilterDTO{
    id?:number,
    content?:string,
    userId?:number,
    isLocked?:boolean,
    postId?:number,
    createdTimeFrom?:string,
    createdTimeTo?:string,
    postPrivacy?:boolean
}