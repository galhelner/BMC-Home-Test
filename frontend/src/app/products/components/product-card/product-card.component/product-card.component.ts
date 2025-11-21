import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Product } from '../../../models/product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'product-card',
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {
  @Input() product!: Product;

  addToCart() {
    // Logic to add the product to the cart
    // TODO: Store the product in the cart in local storage
    console.log(`Product ${this.product.name} added to cart.`);
  }
}
