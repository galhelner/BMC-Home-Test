import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../../../models/user';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'register-form',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css',
})
export class RegisterFormComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      // Email field: Required, and must be a valid email format
      email: ['', [Validators.required, Validators.email]],

      // Password field: Required, and must meet custom password criteria
      password: ['', [Validators.required, this.authService.passwordValidator]],

      // Confirm Password field: required
      confirmPassword: ['', Validators.required]

    }, {
      // confirmPassword must match password
      validators: this.authService.passwordMatchValidator
    });
  }

  // Getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const user: User = {
        email: this.f['email'].value,
        password: this.f['password'].value
      }
      this.authService.registerNewUser(user);
    } else {
      this.registerForm.markAllAsTouched();
      console.log('Form is invalid');
    }
  }
}