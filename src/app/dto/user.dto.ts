
export class UserDTO{
    email:string;
    username:string;
    password:string;
    urlAvatar?:string;

    constructor(data:any){
        this.email=data.email;
        this.username=data.userName;
        this.password=data.password;
        this.urlAvatar=data.urlAvatar
    }
}