import { RouterModule, Routes } from '@angular/router';
import { RegisterPageComponent } from './auth/pages/register/register-page.component/register-page.component';
import { LoginPageComponent } from './auth/pages/login/login-page.component/login-page.component';
import { AppPageComponent } from './dashboard/pages/app-page/app-page.component/app-page.component';
import { ProductsPageComponent } from './products/pages/products-page/products-page.component/products-page.component';
import { CartPageComponent } from './products/pages/cart-page/cart-page.component/cart-page.component';
import { HomePageComponent } from './home/pages/home-page/home-page.component/home-page.component';
import { authGuard } from './auth/guards/auth.guard';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    { path: 'auth/register', component: RegisterPageComponent },
    { path: 'auth/login', component: LoginPageComponent },
    { path: 'dashboard', component: AppPageComponent, canActivate: [authGuard], children: [
        { path: 'home', component: HomePageComponent },
        { path: 'products', component: ProductsPageComponent },
        { path: 'cart', component: CartPageComponent },
        { path: '', redirectTo: 'home', pathMatch: 'full' },
    ] },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
