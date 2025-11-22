import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../../../models/user';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'register-form',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css',
})
export class RegisterFormComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

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

  async onSubmit(): Promise<void> {
    if (this.registerForm.valid) {
      const user: User = {
        email: this.f['email'].value,
        password: this.f['password'].value
      }
      const result = await this.authService.registerNewUser(user);
      if (result) {
        this.router.navigate(['/dashboard']);
      } else {
        alert('A user with this email is already exists!');
      }
    } else {
      this.registerForm.markAllAsTouched();
      console.log('Form is invalid');
    }
  }
}