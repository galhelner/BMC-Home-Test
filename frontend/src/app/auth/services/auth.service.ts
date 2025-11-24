import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { AbstractControl } from '@angular/forms';
import * as bcrypt from 'bcryptjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError, of } from 'rxjs';
import { AuthPayload } from '../models/auth.payload';
import { AuthResponse } from '../models/auth.response';
import { AuthMeResponse } from '../models/auth.me';

const AUTH_TOKEN_KEY = 'auth_token'; // Key for localStorage
const AUTH_USER_KEY = 'auth_user'; // Key for storing authenticated user
const REGISTERED_USERS_KEY = 'registeredUsers'; // Key for localStorage of users
const CART_ITEMS_KEY = 'cart_items'; // Key for localStorage of cart items
const SALT_ROUNDS = 10; // Number of salt rounds for bcrypt
const BASE_URL = 'http://localhost:3000'; // Backend server base url
const REGISTER_URL = BASE_URL + '/auth/register';
const LOGIN_URL = BASE_URL + '/auth/login';
const ME_URL = BASE_URL + '/auth/me';

@Injectable({
    // makes the service a singleton accessible everywhere
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient) { }

    /**
     * Checks if the user is currently authenticated.
     * Checks for the presence of a token in localStorage.
     */
    isAuthenticated(): boolean {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        return !!token;
    }

    getAuthToken(): Observable<string | null> {
         const token = localStorage.getItem(AUTH_TOKEN_KEY);
         return of(token);
    }

    getAuthUser(): Observable<string> {
        return this.http.get<AuthMeResponse>(ME_URL).pipe(
            map(response => response.name), 
            catchError((err) => {
                console.error("AuthService HTTP Error:", err);
                return throwError(() => err);
            })
        );
    }

    /**
     * Call backend API to login the user.
     */
    login(payload: AuthPayload): Observable<string> {
        return this.http.post<AuthResponse>(LOGIN_URL, payload).pipe(
            map((response) => {
                localStorage.setItem(AUTH_TOKEN_KEY, response.token);
                return response.token;
            }),
            catchError((error: HttpErrorResponse) => {
                console.error('Login API error:', error);

                if (error.status === 401) {
                    return throwError(() => new Error(error.error?.message || 'Invalid email or password.'));
                }

                return throwError(() => new Error('Could not log in due to a server error.'));
            })
        );
    }

    /**
     * Call backend API to register a new user.
     */
    register(payload: AuthPayload): Observable<string> {
        return this.http.post<AuthResponse>(REGISTER_URL, payload).pipe(
            map((response) => {
                localStorage.setItem(AUTH_TOKEN_KEY, response.token);
                return response.token;
            }),
            catchError((error: HttpErrorResponse) => {
                console.error('Registration API error:', error);

                if (error.status === 400) {
                    return throwError(() => new Error(error.error?.message || 'User already exists.'));
                }
                return throwError(() => new Error('Could not register due to a server error.'));
            })
        );
    }

    /**
     * Exits the user session.
     */
    logout(): void {
        // Remove the token and authenticated username from storage
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
        localStorage.removeItem(CART_ITEMS_KEY);
    }

    /**
     * retrieves all registered users from local storage
     */
    getAllUsers(): User[] {
        const usersJson = localStorage.getItem(REGISTERED_USERS_KEY);
        return usersJson ? JSON.parse(usersJson) : [];
    }

    /**
    * save all users to local storage
    * @param users - array of users to be saved
    */
    saveAllUsers(users: User[]): void {
        const userArrayString = JSON.stringify(users);
        localStorage.setItem(REGISTERED_USERS_KEY, userArrayString);
    }

    /**
     * register a new user
     * @param newUser - user to be registered
     */
    async registerNewUser(newUser: User): Promise<boolean> {
        const existingUsers = this.getAllUsers();
        if (existingUsers.find(user => user.email === newUser.email)) {
            return false;
        }

        // store the new user for future logins
        const userForLogin: User = {
            email: newUser.email,
            password: newUser.password
        };

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(newUser.password, SALT_ROUNDS);
        newUser.password = hashedPassword;

        // Store the new user
        existingUsers.push(newUser);
        this.saveAllUsers(existingUsers);
        console.log(`User ${newUser.email} registered successfully`);
        await this.login(userForLogin); // Auto-login after registration
        return true;
    }

    /**
     * password format validator
     * @param control - form control
     * @returns validation errors or null
     */
    passwordValidator(control: AbstractControl) {
        const password = control.value;

        if (!password) {
            return null;
        }

        const minLengthValid = password.length >= 6;
        const hasCapitalLetter = /[A-Z]+/.test(password);

        if (!minLengthValid) {
            return { minLength: true };
        }

        if (!hasCapitalLetter) {
            return { hasCapital: true };
        }

        return null;
    }

    /**
     * password match validator
     * @param control - form group control
     * @returns validation errors or null
     */
    passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
        const password = control.get('password');
        const confirmPassword = control.get('confirmPassword');

        if (password && confirmPassword && password.value !== confirmPassword.value) {
            return { mismatch: true };
        } else {
            return null;
        }
    }
}