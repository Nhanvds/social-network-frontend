
export interface PostResponse{
    id:number,
    content:string,
    postPrivacyStatus:string,
    createdTime:Date,
    updatedTime:Date,
    userId:number,
    isLocked:boolean,
    username:number,
    urlAvatar:string,
    postImages?:String[],
    likedReactions:number,
    dislikedReactions:number,
    hasLiked:boolean,
    hasDisLiked:boolean,
}