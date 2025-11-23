import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { CartItem } from '../models/cart-item';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/services/auth.service';
// 1. Import necessary RxJS tools
import { Observable, BehaviorSubject, map, tap, switchMap, catchError, of } from 'rxjs'; 
import { CartResponse } from '../models/cart-response';

const BASE_URL = 'http://localhost:3000';
const PRODUCTS_URL = BASE_URL + '/products';
const CART_URL = PRODUCTS_URL + '/cart';

@Injectable({
    providedIn: 'root'
})
export class ProductsService {
    
    // 2. Central State: Private BehaviorSubject initialized with an empty array.
    private _cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
    
    // 3. Public Stream: Components subscribe to this stable reference.
    readonly cartItems$: Observable<CartItem[]> = this._cartItemsSubject.asObservable(); 

    constructor(private http: HttpClient, private authService: AuthService) { }

    /**
     * 🟢 NEW LOGIC: Fetches cart data from API and pushes it to the Subject.
     * This method is the core of the state refresh mechanism.
     */
    fetchAndRefreshCart(): Observable<CartItem[]> {
        // Use the existing logic to fetch and map the response
        return this.http.get<CartResponse>(CART_URL).pipe(
            map(response => {
                if (response && response.resultItems) {
                    return response.resultItems;
                }
                return [];
            }),
            tap(items => {
                // PUSH the fresh data into the central state stream (BehaviorSubject)
                this._cartItemsSubject.next(items); 
            }),
            catchError(err => {
                console.error("Failed to refresh cart state:", err);
                this._cartItemsSubject.next([]); // Clear cart state on error
                return of([]); // Return an empty Observable to allow the stream to complete
            })
        );
    }
    
    /**
     * Retains the original logic, now used by fetchAndRefreshCart internally.
     * NOTE: This is kept for clarity, but you could merge it into fetchAndRefreshCart.
     */
    getCartItems(): Observable<CartItem[]> {
        return this.http.get<CartResponse>(CART_URL).pipe(map(response => {
            if (response && response.resultItems) {
                return response.resultItems;
            }
            return [];
        }));
    }

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(PRODUCTS_URL);
    }

    /**
     * Adds a product to the cart. Upon successful addition, refreshes the state.
     */
    addProductToCart(product: Product): Observable<any> {
        const payload = { product_id: product.id };
        
        return this.http.post(CART_URL, payload).pipe(
            // After successful POST, switch to the refresh stream
            switchMap(() => this.fetchAndRefreshCart()) 
        );
    }

    /**
     * Removes a product from the cart. Upon successful deletion, refreshes the state.
     */
    removeProductFromCart(productId: number): Observable<any> {
        const payload = { product_id: productId };
        
        return this.http.delete(CART_URL, { body: payload }).pipe(
            // After successful DELETE, switch to the refresh stream
            switchMap(() => this.fetchAndRefreshCart()) 
        );
    }

    /**
     * Updates cart item quantity. Upon successful update, refreshes the state.
     */
    updateCartItemQuantity(productId: number, quantity: number): Observable<any> {
        const payload = { product_id: productId, quantity };
        
        return this.http.put(CART_URL, payload).pipe(
            // After successful PUT, switch to the refresh stream
            switchMap(() => this.fetchAndRefreshCart()) 
        );
    }
}