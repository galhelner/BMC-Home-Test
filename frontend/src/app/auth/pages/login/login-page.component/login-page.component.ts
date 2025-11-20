import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from '../../../components/login-form/login-form.component/login-form.component';

@Component({
  selector: 'login-page',
  imports: [CommonModule, LoginFormComponent],
  standalone: true,
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {

}
