import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit{

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {  }

  ngOnInit(): void {
    let token: string | null = window.localStorage.getItem('token');
    if(token) {
      this.router.navigate(['/home-admin']);
    }
  }

  email = new FormControl('');

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  onSubmit() {
    this.adminService.login(this.email.value!).subscribe((data: any) => {
      console.log(data);
      if(!data) {
        alert('invalid credentials');
      } else {
        window.localStorage.setItem('token', data.id);
        this.router.navigate(['/home-admin']);
      }
    })
  }
}
