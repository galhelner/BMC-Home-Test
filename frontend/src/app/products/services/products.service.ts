import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { CartItem } from '../models/cart-item';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../auth/services/auth.service';
import { delay, Observable } from 'rxjs';

const CART_ITEMS_KEY = 'cart_items'; // Key for localStorage of cart items
const BASE_URL = 'http://localhost:3000';
const PRODUCTS_URL = BASE_URL + '/products';

@Injectable({
    // makes the service a singleton accessible everywhere
    providedIn: 'root'
})
export class ProductsService {
    constructor(private http: HttpClient, private authService: AuthService) { }

    /**
     * Retrives the list of products. Currently returns mock data.
     */
    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(PRODUCTS_URL);
    }

    /**
     * Get the list items in the cart.
     */
    getCartItems(): CartItem[] {
        const itemsJson = localStorage.getItem(CART_ITEMS_KEY);
        return itemsJson ? JSON.parse(itemsJson) : [];
    }

    /**
     * Adds a product to the cart by its ID.
     */
    addProductToCart(product: Product): void {
        // get current items in cart
        const cartItems = this.getCartItems();

        // check if product already in cart
        const existingItem = cartItems.find(item => item.product.id === product.id);
        
        if (existingItem) {
            // increment quantity if already in cart
            existingItem.quantity += 1;
        } else {
            // add new item to cart
            const newCartItem: CartItem = { product: product, quantity: 1 };
            cartItems.push(newCartItem);
        }
        localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(cartItems));
    }

    /**
     * Removes a product from the cart by its ID.
     * @param productId - ID of the product to remove
     */
    removeProductFromCart(productId: number): void {
        const cartItems = this.getCartItems();
        const updatedItems = cartItems.filter(item => item.product.id !== productId);
        localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(updatedItems));
    }

    /**
     * Updates the quantity of a cart item.
     * @param productId - ID of the product to update
     * @param quantity - New quantity to set
     */
    updateCartItemQuantity(productId: number, quantity: number): void {
        const cartItems = this.getCartItems();
        const itemToUpdate = cartItems.find(item => item.product.id === productId);
        if (itemToUpdate) {
            itemToUpdate.quantity = quantity;
            localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(cartItems));
        }
    }

    /**
     * Gets the products data that are currently in the cart.
     */
    getCartProducts(): Product[] {
        const cartItems = this.getCartItems();
        return cartItems.map(item => item.product);
    }
}