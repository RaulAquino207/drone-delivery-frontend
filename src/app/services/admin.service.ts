import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private url = `${environment.apiUrl}/api/admin`;

  constructor(private http: HttpClient) { }

  login(email: string): Observable<any>{
    let params = new HttpParams()
      .append("email", email);
    return this.http.get<any>(this.url + `/login`, {
      params
    });
  }

  bringLoggedInUserData(id: string): Observable<any> {
    return this.http.get<any>(this.url + `/${id}`,);
  }
}
