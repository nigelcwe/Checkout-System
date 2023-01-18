import { AuthService } from './../../services/auth.service';
import { Subscription } from 'rxjs';
import { ProductService } from './../../services/product.service';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/models/product';
import { User } from 'src/app/models/user';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

declare var window: any;

@Component({
  selector: 'app-product-display',
  templateUrl: './product-display.component.html',
  styleUrls: ['./product-display.component.css']
})
export class ProductDisplayComponent implements OnInit {
  private subscription = new Subscription();
  currUser!: User;
  currProduct!: Product;
  formModal: any;
  loading = false;
  submitted = false;

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,

  ) { }

  form: FormGroup = new FormGroup({
    qty: new FormControl('')
  })

  ngOnInit(): void {
    this.subscription.add(this.authService.currUser$.subscribe(user => {
      this.currUser = user;
    }))
    this.subscription.add(this.productService.currProduct$.subscribe(product => {
      this.currProduct = product;
    }))

    this.form = this.formBuilder.group({
      qty: ['', [Validators.required, Validators.min(0)]]
    })

    this.formModal = new window.bootstrap.Modal(
      document.getElementById("productModal")
    );

    this.formModal.show();
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }
  }

}
