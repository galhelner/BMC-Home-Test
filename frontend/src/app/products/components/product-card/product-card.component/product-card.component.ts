import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Product } from '../../../models/product';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../../services/products.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'product-card',
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {
  @Input() product!: Product;

  constructor(private productsService: ProductsService, private toastr: ToastrService) {}

  addToCart() {
    this.productsService.addProductToCart(this.product).subscribe({
      next: (response) => {
        this.toastr.success(
          `${this.product.name} has been added to your cart.`,
          'Added to Cart',
        );
      },
      error: (err) => {
        console.error('Failed to add to cart:', err);
        alert('Error adding item to cart. Please try again.');
      }
    });


    this.productsService.addProductToCart(this.product);
  }
}
