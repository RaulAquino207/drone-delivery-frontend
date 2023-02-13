import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css'],
})
export class UserLoginComponent implements OnInit {

  constructor(
    private userService: UserService,
    private router: Router
  ) {  }

  ngOnInit(): void {
    let token: string | null = window.localStorage.getItem('token');
    if(token) {
      this.router.navigate(['/home-user']);
    }
  }

  login = new FormControl('');

  getErrorMessage() {
    if (this.login.hasError('required')) {
      return 'You must enter a value';
    }

    return this.login.hasError('login') ? 'Not a valid email' : '';
  }

  onSubmit() {
    this.userService.login(this.login.value!).subscribe((data: any) => {
      console.log(data);
      if(!data) {
        alert('invalid credentials');
      } else {
        window.localStorage.setItem('token', data.id);
        this.router.navigate(['/home-user']);
      }
    })
  }
}
