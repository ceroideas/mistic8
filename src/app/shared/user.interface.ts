export interface User{
    uid:string;
    email:string;
    displayName:string;
    emailVerified:boolean;
}

export interface UserData{
    uid:string;
    email:string;
    displayName:string;
    emailVerified:boolean;
    
    name:string;
    notificationEmail:string;
    gender:string;
    country:string;
    state:string;

    avatar:string;
    
}
