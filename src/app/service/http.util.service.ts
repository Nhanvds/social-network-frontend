import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";


@Injectable({
    providedIn: 'root'
})
export class HttpUtilService{
    createHeader():HttpHeaders{
        return new HttpHeaders(
            {
                'Content-Type':'application/json'
            }
        )
    }
}