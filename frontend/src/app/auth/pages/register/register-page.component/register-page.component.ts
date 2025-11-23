import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterFormComponent } from '../../../components/register-form/register-form.component/register-form.component';

@Component({
  selector: 'register-page',
  imports: [CommonModule, RegisterFormComponent],
  standalone: true,
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
})
export class RegisterPageComponent {

}
