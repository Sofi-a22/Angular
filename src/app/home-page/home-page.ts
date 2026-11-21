import { Component } from '@angular/core';
import { ProductsComponent } from '../products/products.component';

@Component({
  selector: 'app-home-page',
  imports: [ProductsComponent],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {}