import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../../services/products.service';
import { CartItemComponent } from '../../../components/cart-item/cart-item.component/cart-item.component';
import { CartItem } from '../../../models/cart-item';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'cart-page',
  imports: [CommonModule, CartItemComponent, RouterLink],
  standalone: true,
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css',
})
export class CartPageComponent implements OnInit {
  cartItems: CartItem[] = [];
  shippingCost: number = 5.99;

  constructor(public productsService: ProductsService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartItems = this.productsService.getCartItems();
  }

  get totalItems(): number {
    // Calculates the total number of distinct items (products) in the cart
    return this.cartItems.reduce((count, item) => count + item.quantity, 0);
  }

  get cartSubtotal(): number {
    // Calculates the total price of all items combined (Price * Quantity)
    return this.cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }

  get cartTotal(): number {
    // Calculates the final price including shipping and potential taxes (omitted here)
    return this.cartSubtotal + this.shippingCost;
  }

  // --- Event Handlers for Child Component Actions ---

  /**
   * Called when a quantity is changed in a child component.
   * Updates the service and reloads the local data.
   */
  updateItemQuantity(event: { productId: number, quantity: number }): void {
    // Use a service method to update the quantity in localStorage
    this.productsService.updateCartItemQuantity(event.productId, event.quantity);
    
    // Refresh the local array to reflect the change (and update calculations)
    this.loadCart(); 
  }

  /**
   * Called when the remove button is clicked in a child component.
   */
  deleteItem(productId: number): void {
    // Use a service method to remove the item from localStorage
    this.productsService.removeProductFromCart(productId); 
    
    // Refresh the local array
    this.loadCart();
  }

  trackByProductId(index: number, item: CartItem): number {
    return item.product.id;
  }

}
