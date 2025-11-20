import { Routes } from '@angular/router';
import { RegisterPageComponent } from './auth/pages/register/register-page.component/register-page.component';
import { LoginPageComponent } from './auth/pages/login/login-page.component/login-page.component';

export const routes: Routes = [
    { path: 'auth/register', component: RegisterPageComponent },
    { path: 'auth/login', component: LoginPageComponent },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
