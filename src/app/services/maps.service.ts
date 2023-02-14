import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapsService {

  constructor(private http: HttpClient) { }

  apiLoaded!: Observable<boolean>;

  lazyLoad(){
    this.apiLoaded = this.http.jsonp('https://maps.googleapis.com/maps/api/js?key=AIzaSyCQBQF3cPhZCMVpO1Bk6iIFFP9Vri8RB80', 'callback')
        .pipe(
          map(() => true),
          catchError(() => of(false)),
        );
  }
}
