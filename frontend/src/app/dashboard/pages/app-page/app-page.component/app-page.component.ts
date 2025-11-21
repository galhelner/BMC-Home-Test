import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
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

  constructor(private authService: AuthService) {}
  
  ngOnInit(): void {
    this.authenticatedUser = this.authService.getAuthenticatedUser() || 'Guest';
  }
}
