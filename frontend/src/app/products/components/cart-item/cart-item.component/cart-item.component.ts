import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../../models/cart-item';

@Component({
  selector: 'cart-item',
  imports: [CommonModule],
  standalone : true,
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.css',
})
export class CartItemComponent {
  // Input: Receives the specific item data from the parent (CartPageComponent)
  @Input() item!: CartItem;

  // Output: Emits the product ID and the new quantity for the parent to update the service
  @Output() quantityChange = new EventEmitter<{ productId: number, quantity: number }>();
  
  // Output: Emits when the remove button is clicked
  @Output() removeItem = new EventEmitter<number>();

  /**
   * Helper method to emit the change event to the parent component.
   */
  private emitQuantityChange(newQuantity: number): void {
    this.quantityChange.emit({
      // Access the ID from the nested product object
      productId: this.item.product.id, 
      quantity: newQuantity
    });
  }

  /**
   * Handles quantity changes via the + and - buttons.
   * @param delta The amount to change the quantity by (+1 or -1).
   */
  updateQuantity(delta: number): void {
    let newQuantity = this.item.quantity + delta;
    
    // Ensure quantity is not less than 1
    if (newQuantity >= 1) {
      this.emitQuantityChange(newQuantity);
    }
  }

  /**
   * Handles quantity changes when the user directly types into the input field.
   * @param event The DOM change event.
   */
  onQuantityInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let newQuantity = parseInt(inputElement.value, 10);
    
    // Validate the quantity: must be a number and at least 1
    if (isNaN(newQuantity) || newQuantity < 1) {
      newQuantity = 1;
      // Reset the input field value if invalid
      inputElement.value = '1'; 
    }
    
    this.emitQuantityChange(newQuantity);
  }
}
