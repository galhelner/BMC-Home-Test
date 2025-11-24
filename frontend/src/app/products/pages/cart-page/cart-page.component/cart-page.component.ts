import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../../services/products.service';
import { CartItemComponent } from '../../../components/cart-item/cart-item.component/cart-item.component';
import { CartItem } from '../../../models/cart-item';
import { RouterLink } from '@angular/router';
import { Observable, map, shareReplay, Subscription } from 'rxjs';

@Component({
  selector: 'cart-page',
  imports: [CommonModule, CartItemComponent, RouterLink],
  standalone: true,
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css',
})
export class CartPageComponent implements OnInit, OnDestroy {
  // --- Data Streams ---
  cartItems$!: Observable<CartItem[]>;
  shippingCost: number = 5.99;

  // --- Calculated Streams (Derived from cartItems$) ---
  totalItems$!: Observable<number>;
  cartSubtotal$!: Observable<number>;
  cartTotal$!: Observable<number>;

  // Used to manage the subscription for the initial load
  private initialLoadSub = new Subscription();

  constructor(public productsService: ProductsService) {
    this.cartItems$ = this.productsService.cartItems$;

    // Calculate the total number of items
    this.totalItems$ = this.cartItems$.pipe(
      map(items => items.reduce((count, item) => count + item.quantity, 0))
    );

    // Calculate the subtotal (using shareReplay to avoid re-calculation for cartTotal$)
    this.cartSubtotal$ = this.cartItems$.pipe(
      map(items => items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    // Calculate the final total (subtotal + shipping)
    this.cartTotal$ = this.cartSubtotal$.pipe(
      map(subtotal => subtotal + this.shippingCost)
    );
  }

  ngOnInit(): void {
    // and populate the service's BehaviorSubject.
    this.initialLoadSub = this.productsService.fetchAndRefreshCart().subscribe({
      error: (err) => {
        console.error('Initial cart load failed:', err);
      }
    });
  }

  ngOnDestroy(): void {
    // Clean up the manual subscription when the component is destroyed.
    this.initialLoadSub.unsubscribe();
  }

  // --- Event Handlers (Rely on Service for Stream Refresh) ---

  updateItemQuantity(event: { productId: number, quantity: number }): void {
    // Check if quantity is valid before calling the API
    if (event.quantity < 1) {
      this.deleteItem(event.productId);
      return;
    }

    // Call the service; the successful API response triggers fetchAndRefreshCart()
    // which updates the central BehaviorSubject, refreshing the entire component state.
    this.productsService.updateCartItemQuantity(event.productId, event.quantity).subscribe({
      error: (err) => console.error('Failed to update quantity:', err)
    });
  }

  deleteItem(productId: number): void {
    // Call the service; the successful API response triggers fetchAndRefreshCart()
    // which updates the central BehaviorSubject, refreshing the entire component state.
    this.productsService.removeProductFromCart(productId).subscribe({
      next: () => {
        console.log(`Product ${productId} deleted successfully.`);
      },
      error: (err) => {
        console.error('Failed to delete item:', err);
        alert('Error removing item from cart. Please check the console.');
      }
    });
  }

  trackByProductId(index: number, item: CartItem): number {
    return item.product.id;
  }
}