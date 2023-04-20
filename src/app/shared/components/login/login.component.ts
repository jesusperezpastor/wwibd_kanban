import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/core/services/userService/user.service';
import { UserSchema } from 'src/app/core/';
import { Router } from '@angular/router'
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit, AfterViewInit {
  access!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private app: AppComponent) { }

  ngOnInit(): void {
    this.setForm();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.app.showHeader = false;
    });
  }

  setForm(): void {
    this.access = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login(form: UserSchema) {
    console.log("Petición de Login desde el Front → email [" + form.email + "], password [" + form.password + "].");
    this.userService.login(form).subscribe(data => {
      setTimeout(() => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.user._id);
        localStorage.setItem('userFirstName', data.user.firstName);
        localStorage.setItem('userLastName', data.user.lastName);
        localStorage.setItem('userEmail', data.user.email);
        this.router.navigate(['/project']);
      });
    },
      err => {
        console.log(err);
      })
  }

}


