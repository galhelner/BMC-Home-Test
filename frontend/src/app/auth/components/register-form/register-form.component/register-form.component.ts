import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, AbstractControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../../../models/user';

const REGISTERED_USERS_KEY = 'registeredUsers';

@Component({
  selector: 'register-form',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css',
})
export class RegisterFormComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      // Email field: Required, and must be a valid email format
      email: ['', [Validators.required, Validators.email]],

      // Password field: Required, and must meet custom password criteria
      password: ['', [Validators.required, passwordValidator]],

      // Confirm Password field: required
      confirmPassword: ['', Validators.required]

    }, {
      // confirmPassword must match password
      validators: passwordMatchValidator
    });
  }

  // Getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit(): void {
    if (this.registerForm.valid) {
      // TODO: Handle successful form submission
      const user: User = {
        email: this.f['email'].value,
        password: this.f['password'].value
      }
      registerNewUser(user);
    } else {
      this.registerForm.markAllAsTouched();
      console.log('Form is invalid');
    }
  }
}

/**
 * retrieve all users from local storage
 */ 
function getAllUsers(): User[] {
  const usersJson = localStorage.getItem(REGISTERED_USERS_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
}

/**
 * save all users to local storage
 * @param users - array of users to be saved
 */
function saveAllUsers(users: User[]): void {
  const userArrayString = JSON.stringify(users);
  localStorage.setItem(REGISTERED_USERS_KEY, userArrayString);
}

/**
 * register a new user
 * @param newUser - user to be registered
 */
function registerNewUser(newUser: User): void {
  const existingUsers = getAllUsers();
  if (existingUsers.find(user => user.email === newUser.email)) {
    alert('A user with this email is already exists!');
    return;
  }
  existingUsers.push(newUser);
  saveAllUsers(existingUsers);
  console.log(`User ${newUser.email} registered successfully`);
}

/**
 * password format validator
 * @param control - form control
 * @returns validation errors or null
 */
function passwordValidator(control: AbstractControl) {
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
function passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null{
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { mismatch: true };
  } else {
    return null;
  }
}
