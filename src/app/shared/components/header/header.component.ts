import { Component } from '@angular/core';
import { UserService } from 'src/app/core/services/userService/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent {

  constructor(private userService: UserService) {

  }

  logOut() {
    this.userService.logout().subscribe(response => {
      console.log(response);
    }, error => {
      console.log(error);
    });
  }

}
