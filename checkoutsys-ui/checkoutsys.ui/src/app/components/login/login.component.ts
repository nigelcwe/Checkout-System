import { Component, OnInit } from '@angular/core';

declare var window:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public formModal:any;

  constructor() { }

  ngOnInit(): void {
    this.formModal = new window.bootstrap.Modal(
      document.getElementById("loginModal")
    );
    this.formModal.show();
  }

  

  doSomething() {
    this.formModal.hide();
  }
}
