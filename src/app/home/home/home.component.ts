import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { UserService } from 'src/app/core/services/userService/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})

export class HomeComponent implements OnInit {
  user: any;

  constructor(private userService: UserService, private app: AppComponent) {
    this.user = this.userService.getUser();
  }

  ngOnInit(): void {
    this.app.showHeader = true;
  }
}
