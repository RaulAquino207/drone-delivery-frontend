import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) { }

  login(login: string): Observable<any>{
    let params = new HttpParams()
      .append("login", login);
    return this.http.get<any>(this.url + `/login`, {
      params
    });
  }

  bringLoggedInUserData(id: string): Observable<any> {
    return this.http.get<any>(this.url + `/${id}`,);
  }
}
