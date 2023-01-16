import { UserService } from 'src/app/services/user.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,

  ) { }

    form: FormGroup = new FormGroup({
      username: new FormControl(''),
      password: new FormControl('')
    })

  ngOnInit(): void {
    this.subscription = this.userService.currUser$.subscribe(user => 
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
    try {
      var result$ = this.userService.login(this.f['username'].value, this.f['password'].value)
      this.currUser = await lastValueFrom(result$);
    } catch (error) {
      this.loading = false;
      return;
    }
    
    
    console.log(this.currUser);
    this.userService.updateCurrUser(this.currUser);
    document.getElementById("loginModalClose")?.click();
  }
}
