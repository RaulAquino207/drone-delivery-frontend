import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit{

  admin: any;

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {  }

  ngOnInit(): void {
    let token: string | null = window.localStorage.getItem('token');
    if(token) {
      this.bringLoggedInUserData(token);
    } else {
      this.router.navigate(['/login-admin']);
    }
  }

  bringLoggedInUserData(id: string) {
    return this.adminService.bringLoggedInUserData(id).subscribe((data) => {
      if(!data.warehouse) {
        window.localStorage.removeItem('token');
        this.router.navigate(['/login-user']);
      } else {
        this.admin = data;
      }
    });
  }

}
