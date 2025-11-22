import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Product } from '../../../models/product';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../../services/products.service';

@Component({
  selector: 'product-card',
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {
  @Input() product!: Product;

  constructor(private productsService: ProductsService) {}

  addToCart() {
    console.log(`Product ${this.product.name} added to cart.`);
    this.productsService.addProductToCart(this.product);
  }
}
