import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom, Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

declare var window: any;

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  private subscription!: Subscription;
  currUser!: User;
  public formModal: any;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,

  ) { }

    form: FormGroup = new FormGroup({
      fullName: new FormControl(''),
      username: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl(''),
    })

  ngOnInit(): void {
    this.subscription = this.userService.currUser$.subscribe(user => 
      {
        this.currUser = user;
      })

    this.formModal = new window.bootstrap.Modal(
      document.getElementById("registrationModal")
    );
    
    this.form = this.formBuilder.group({
      fullName: ['', Validators.required],
      username: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9_]*$"), Validators.maxLength(20), Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]]
    })

    this.formModal.show();
    console.log(this.currUser.id, this.currUser.username)
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
      var result$ = this.userService.register(
        this.f['fullName'].value,
        this.f['username'].value,
        this.f['email'].value,
        this.f['password'].value
      )
      this.currUser = await lastValueFrom(result$);
    } catch (error) {
      this.loading = false;
      return;
    }
    
    console.log(this.currUser);
    this.userService.updateCurrUser(this.currUser);
    this.loading = false;
    document.getElementById("registrationModalClose")?.click();
  }
}
