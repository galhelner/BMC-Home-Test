import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { AbstractControl } from '@angular/forms';
import * as bcrypt from 'bcryptjs';

const AUTH_TOKEN_KEY = 'auth_token'; // Key for localStorage
const AUTH_USER_KEY = 'auth_user'; // Key for storing authenticated user
const REGISTERED_USERS_KEY = 'registeredUsers'; // Key for localStorage of users
const SALT_ROUNDS = 10; // Number of salt rounds for bcrypt

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
    async login(user: User): Promise<boolean> {
        const registeredUsers = this.getAllUsers();
        const userFound = registeredUsers.find(async u => {
            const passwordMatch = await bcrypt.compare(user.password, u.password);
            return u.email === user.email && passwordMatch;
        });

        if (userFound) {
            localStorage.setItem(AUTH_TOKEN_KEY, 'dummy-token');
            localStorage.setItem(AUTH_USER_KEY, user.email);
            return true;
        } else {
            return false;
        }
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

    getAuthenticatedUser(): string | null {
        return localStorage.getItem(AUTH_USER_KEY);
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

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(newUser.password, SALT_ROUNDS);
        newUser.password = hashedPassword;

        // Store the new user
        existingUsers.push(newUser);
        this.saveAllUsers(existingUsers);
        console.log(`User ${newUser.email} registered successfully`);
        await this.login(newUser); // Auto-login after registration
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