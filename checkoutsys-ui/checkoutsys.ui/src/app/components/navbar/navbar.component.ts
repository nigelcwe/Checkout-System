import { LoginComponent } from './../login/login.component';
import { User } from './../../models/user';
import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Input() user?: User;

  constructor(private userService: UserService) {
  }

  ngOnInit() : void {
  }
}
