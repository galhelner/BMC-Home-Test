import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { AbstractControl } from '@angular/forms';

const AUTH_TOKEN_KEY = 'auth_token'; // Key for localStorage
const REGISTERED_USERS_KEY = 'registeredUsers'; // Key for localStorage of users

@Injectable({
    // makes the service a singleton accessible everywhere
    providedIn: 'root'
})
export class AuthService {

    constructor(private router: Router) { }

    /**
     * Checks if the user is currently authenticated.
     * Checks for the presence of a token in localStorage.
     */
    isAuthenticated(): boolean {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        return !!token;
    }

    /**
     * Logs in the user by saving the token and redirecting.
     */
    login(token: string): void {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        this.router.navigate(['/dashboard']);
    }

    /**
     * Exits the user session.
     */
    logout(): void {
        // Remove the token from storage
        localStorage.removeItem(AUTH_TOKEN_KEY);

        // Redirect to the login page
        this.router.navigate(['/login']);
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
    registerNewUser(newUser: User): void {
        const existingUsers = this.getAllUsers();
        if (existingUsers.find(user => user.email === newUser.email)) {
            alert('A user with this email is already exists!');
            return;
        }
        existingUsers.push(newUser);
        this.saveAllUsers(existingUsers);
        console.log(`User ${newUser.email} registered successfully`);
        this.login('dummy-token'); // Auto-login after registration
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