
export class UserDTO{
    email:string;
    username:string;
    password:string;

    constructor(data:any){
        this.email=data.email;
        this.username=data.userName;
        this.password=data.password
    }
}