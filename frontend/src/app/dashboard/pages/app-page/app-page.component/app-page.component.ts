import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../../auth/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-page',
  imports: [CommonModule, RouterOutlet, RouterLink],
  standalone: true,
  templateUrl: './app-page.component.html',
  styleUrl: './app-page.component.css',
})

export class AppPageComponent implements OnInit, OnDestroy {
  authenticatedUser: string = 'Guest';
  private userSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Store the subscription
    this.userSubscription = this.authService.getAuthUser().subscribe({
      next: (email: string) => {
        this.authenticatedUser = email;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Failed to load authenticated user:", err);
        this.authenticatedUser = 'Guest';
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}