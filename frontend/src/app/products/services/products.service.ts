import { Injectable } from '@angular/core';
import { Product } from '../models/product';

const CART_ITEMS_KEY = 'cart_items'; // Key for localStorage of cart items

@Injectable({
    // makes the service a singleton accessible everywhere
    providedIn: 'root'
})
export class ProductsService {
    constructor() { }

    /**
     * Retrives the list of products. Currently returns mock data.
     */
    getProducts(): Product[] {
        return [
            { id: 1, name: 'Premium Espresso Cup', price: 25.99, imageUrl: '/assets/espresso-cup.jpg' },
            { id: 2, name: 'Organic Tea Bags', price: 15.50, imageUrl: '/assets/tea.jpg' },
            { id: 3, name: 'Ceramic Mug Set', price: 45.00, imageUrl: '/assets/mugs.jpg' },
            { id: 4, name: 'Milk Frother', price: 39.99, imageUrl: '/assets/frother.jpeg' },
            { id: 5, name: 'Phone Sillicone Case', price: 5.00, imageUrl: '/assets/phone-case.jpeg' },
            { id: 6, name: 'Basketball', price: 50.00, imageUrl: '/assets/basketball.jpg' },
        ];
    }

    /**
     * Get the list of product IDs in the cart.
     */
    getCartIds(): number[] {
        const itemsJson = localStorage.getItem(CART_ITEMS_KEY);
        return itemsJson ? JSON.parse(itemsJson) : [];
    }

    /**
     * Adds a product to the cart by its ID.
     */
    addProductToCart(product: Product): void {
        const cartItems = this.getCartIds();
        cartItems.push(product.id);
        localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(cartItems));
    }

    /**
     * Gets the products data that are currently in the cart.
     */
    getCartProducts(): Product[] {
        const cartIds = this.getCartIds();
        const allProducts = this.getProducts();
        return allProducts.filter(product => cartIds.includes(product.id));
    }
}