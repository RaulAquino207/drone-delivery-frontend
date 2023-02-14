import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private url = `${environment.apiUrl}/api/order`;

  constructor(private http: HttpClient) { }

  makeOrder(id: string): Observable<any> {
    return this.http.post<any>(this.url, {
      user_id: id
    });
  }

  getActiveSections(id: string) {
    return this.http.get<any>(`${this.url}/active-sections`, {
      params: {
        id
      }
    });
  }
}
