import { AuthService } from './../../services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { lastValueFrom, Subscription } from 'rxjs';
import { User } from 'src/app/models/user';

declare var window:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private subscription?: Subscription;
  currUser!: User;
  public formModal: any;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,

  ) { }

  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  })

  ngOnInit(): void {
    this.subscription = this.authService.currUser$.subscribe(user => 
      {
        this.currUser = user;
      })

    this.formModal = new window.bootstrap.Modal(
      document.getElementById("loginModal")
    );
    
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })

    this.formModal.show();
    console.log(this.currUser.id, this.currUser.username)
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  get f() { return this.form.controls; }

  async onSubmit() {
    this.submitted = true;

    if (this.form.invalid) 
    { 
      return;
    }

    this.loading = true;
    
    var login : boolean = await this.authService.login(this.f['username'].value, this.f['password'].value);
    if (!login) {
      this.loading = false;
      return;
    }
    
    console.log(this.currUser);
    document.getElementById("loginModalClose")?.click();
  }
}
