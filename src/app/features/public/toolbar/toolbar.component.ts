import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit{

  token: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.token = window.localStorage.getItem('token');
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.token = window.localStorage.getItem('token');
      }
   });
  }

  logout() {
    window.localStorage.removeItem('token');
    this.router.navigate(['/login-user']);
  }


}
