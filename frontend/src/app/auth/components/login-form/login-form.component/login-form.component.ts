import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { User } from '../../../models/user';

const REGISTERED_USERS_KEY = 'registeredUsers';

@Component({
  selector: 'login-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      console.log('Form is invalid');
      return;
    }

    const { email, password } = this.loginForm.value;
    const registeredUsers = getAllUsers();
    const userFound = registeredUsers.find(user => user.email === email && user.password === password);

    if (userFound) {
      console.log('Login successful');
      this.router.navigate(['/']); // Navigate to home page on successful login
    } else {
      console.log('Invalid email or password');
      alert('Invalid email or password');
      this.loginForm.reset();
    }
  }
}

/**
 * retrieves all registered users from local storage
 */
function getAllUsers(): User[] {
  const usersJson = localStorage.getItem(REGISTERED_USERS_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
}
