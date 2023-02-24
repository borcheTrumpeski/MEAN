import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Authen } from './authen.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token!: string;
  private isAut = false
  private authListener = new Subject<boolean>()

  constructor(private http: HttpClient) { }

  getToken() {
    return this.token
  }

  getIsAuth() {
    return this.isAut
  }

  getAuthListener() {
    return this.authListener.asObservable()
  }

  createUser(email: string, password: string) {
    const authen: Authen = { email: email, password: password };
    this.http
      .post("http://localhost:3000/api/signup", authen)
      .subscribe(res => {
        console.log(res)
      })
  }

  login(email: string, password: string) {
    const authen: Authen = { email: email, password: password };
    this.http
      .post<{ token: string }>("http://localhost:3000/api/login", authen)
      .subscribe(res => {
        const token = res.token;
        console.log("tokebn", res)
        this.token = token;
        localStorage.setItem("jwt", token);

        if (token) {
          this.isAut = true;
          this.authListener.next(true)
        }
      },)
  }
}
