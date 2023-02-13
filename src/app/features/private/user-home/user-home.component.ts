import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit{

  user: any;

  constructor(
    private userService: UserService,
    private router: Router
  ) {  }

  ngOnInit(): void {
    let token: string | null = window.localStorage.getItem('token');
    if(token) {
      this.bringLoggedInUserData(token);
    } else {
      this.router.navigate(['/login-user']);
    }
  }

  bringLoggedInUserData(id: string) {
    return this.userService.bringLoggedInUserData(id).subscribe((data) => {
      if(data.warehouse) {
        window.localStorage.removeItem('token');
        this.router.navigate(['/login-admin']);
      } else {
        this.user = data;
      }
    });
  }

}
