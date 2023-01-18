import { ProductService } from './../../services/product.service';
import { UserService } from './../../services/user.service';
import { Subscription } from 'rxjs';
import { AdminService } from './../../services/admin.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product';
import { Router } from '@angular/router';

declare var window: any;

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  private subscription = new Subscription();
  tempProduct!: Product;
  currUser!: User;
  currProduct!: Product;
  public formModal: any;
  loading = false;
  submitted = false;

  isStock = false;
  isDetails = false;
  isAdd = false;

  constructor(
    private adminService: AdminService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private productService: ProductService,

  ) { }

  stockForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    name: new FormControl(''),
    details: new FormControl(''),
    price: new FormControl(''),
    stock: new FormControl(''),
  })

  detailsForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    name: new FormControl(''),
    details: new FormControl(''),
    price: new FormControl(''),
    stock: new FormControl(''),
  })

  addForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    name: new FormControl(''),
    details: new FormControl(''),
    price: new FormControl(''),
    stock: new FormControl(''),
  })

  ngOnInit(): void {
    this.subscription.add(this.adminService.currStock$.subscribe(stock => {
      this.isStock = stock;
    }))
    this.subscription.add(this.adminService.currDetails$.subscribe(details => {
      this.isDetails = details;
    }))
    this.subscription.add(this.adminService.currAdd$.subscribe(add => {
      this.isAdd = add;
    }))
    this.subscription.add(this.productService.currProduct$.subscribe(product => {
      this.currProduct = product;
    }))
    this.subscription.add(this.userService.currUser$.subscribe(user => {
      this.currUser = user;
    }))

    if (this.isStock) {
      this.formModal = new window.bootstrap.Modal(
        document.getElementById("stockModal")
      );
    } else if (this.isDetails) {
      this.formModal = new window.bootstrap.Modal(
        document.getElementById("detailsModal")
      );
    } else if (this.isAdd) {
      this.formModal = new window.bootstrap.Modal(
        document.getElementById("addModal")
      );
    }

    this.stockForm = this.formBuilder.group({
      id: [{value: this.currProduct.id, disabled: true}],
      name: [{value: this.currProduct.name, disabled: true}],
      details: [{value: this.currProduct.details, disabled: true}],
      price: [{value: this.currProduct.price, disabled: true}],
      stock: [this.currProduct.stock, [Validators.required, Validators.min(0)]],
    })

    this.detailsForm = this.formBuilder.group({
      id: [{value: this.currProduct.id, disabled: true}],
      name: [this.currProduct.name, [Validators.required, Validators.maxLength(50)]],
      details: [this.currProduct.details, [Validators.required, Validators.maxLength(200)]],
      price: [this.currProduct.price, [Validators.required, Validators.min(1)]],
      stock: [this.currProduct.stock, [Validators.required, Validators.min(0)]],
    })

    this.addForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      details: ['', [Validators.required, Validators.maxLength(200)]],
      price: ['', [Validators.required, Validators.min(1)]],
      stock: ['', [Validators.required, Validators.min(0)]],
    })

    this.formModal.show();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get s() { return this.stockForm.controls; }
  get d() { return this.detailsForm.controls; }
  get a() { return this.addForm.controls; }


  closeModal() {
    this.isStock = false;
    this.adminService.updateCurrStock(this.isStock);

    this.isDetails = false;
    this.adminService.updateCurrDetails(this.isDetails);

    this.isAdd = false;
    this.adminService.updateCurrAdd(this.isAdd);

    this.router.navigateByUrl("/");
  }


  onSubmitStock() {
    this.submitted = true;

    if (this.stockForm.invalid) 
    { 
      return;
    }

    this.loading = true;

    var tempProduct: Product = new Product();
    tempProduct.id = this.currProduct.id;
    tempProduct.stock = this.s['stock'].value;


    try {
      this.productService.putProductStock(
        <number>tempProduct.id,
        <number>tempProduct.stock
      ).subscribe(response => {
        console.log(response);
      })
    } catch (error) {
      this.loading = false;
      return;
    }

    this.loading = false;
    this.isStock = false;
    this.adminService.updateCurrStock(this.isStock);
    document.getElementById("stockModalClose")?.click();
  }

  onSubmitDetails() {
    this.submitted = true;

    if (this.detailsForm.invalid) 
    { 
      return;
    }

    this.loading = true;

    var tempProduct: Product = new Product();
    tempProduct.id = this.currProduct.id;
    tempProduct.admindId = this.currUser.id;
    tempProduct.name = this.d['name'].value;
    tempProduct.details = this.d['details'].value;
    tempProduct.price = this.d['price'].value;
    tempProduct.stock = this.d['stock'].value;


    try {
      this.productService.putProduct(
        <number>tempProduct.id,
        tempProduct.name,
        tempProduct.details,
        <number>tempProduct.price,
        <number>tempProduct.stock
      ).subscribe(response => {
        console.log(response);
      })
    } catch (error) {
      this.loading = false;
      return;
    }

    this.loading = false;
    this.isDetails = false;
    this.adminService.updateCurrDetails(this.isDetails);
    document.getElementById("detailsModalClose")?.click();
  }

  onSubmitAdd() {
    this.submitted = true;

    if (this.addForm.invalid) 
    { 
      return;
    }

    this.loading = true;

    var tempProduct: Product = new Product();
    tempProduct.admindId = this.currUser.id;
    tempProduct.name = this.a['name'].value;
    tempProduct.details = this.a['details'].value;
    tempProduct.price = this.a['price'].value;
    tempProduct.stock = this.a['stock'].value;

    try {
      this.productService.postProduct(
        <number>tempProduct.admindId,
        tempProduct.name,
        tempProduct.details,
        <number>tempProduct.price,
        <number>tempProduct.stock
      ).subscribe(response => {
        console.log(response);
      })
    } catch (error) {
      this.loading = false;
      return;
    }

    this.loading = false;
    this.isAdd = false;
    this.adminService.updateCurrAdd(this.isAdd);
    document.getElementById("addModalClose")?.click();
  }
}
