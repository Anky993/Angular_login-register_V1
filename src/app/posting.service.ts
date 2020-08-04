import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PostingService {

  constructor(public http : HttpClient) { }

  getdata(){
    return this.http.get<any>('http://localhost:9000/get');
  }

  register(registerData){
    return this.http.post<any>('http://localhost:9000/register', registerData);
  }
  registerByGoogle(data){
    return this.http.post<any>('http://localhost:9000/registerBygoogle', data);
  }

  loginByGoogle(searchData){
    return this.http.post<any>('http://localhost:9000/loginBygoogle',searchData)
  }
  login(loginData){
    return this.http.post<any>('http://localhost:9000/login',loginData)
  }
}
