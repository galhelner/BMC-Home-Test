import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../../auth/services/auth.service';

@Component({
  selector: 'app-page',
  imports: [CommonModule, RouterOutlet, RouterLink],
  standalone: true,
  templateUrl: './app-page.component.html',
  styleUrl: './app-page.component.css',
})
export class AppPageComponent implements OnInit {
  authenticatedUser: string = 'Guest';

  constructor(private authService: AuthService, private router: Router) {}
  
  ngOnInit(): void {
    this.authenticatedUser = this.authService.getAuthenticatedUser() || 'Guest';
  }

  logout(): void {
    this.authService.logout();

    // Redirect to the login page
    this.router.navigate(['/auth/login']);
  }
}
