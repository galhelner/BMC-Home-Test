import { Component, OnInit } from '@angular/core';
import { Product } from '../../../models/product';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../../components/product-card/product-card.component/product-card.component';

@Component({
  selector: 'products-page',
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.css',
})
export class ProductsPageComponent implements OnInit {
  products: Product[] = [];

  constructor() {}

  ngOnInit(): void {
    this.products = this.getMockProducts();
  }

  private getMockProducts(): Product[] {
    return [
      { id: 1, name: 'Premium Espresso Cup', price: 25.99, imageUrl: '/assets/espresso-cup.jpg' },
      { id: 2, name: 'Organic Tea Bags', price: 15.50, imageUrl: '/assets/tea.jpg' },
      { id: 3, name: 'Ceramic Mug Set', price: 45.00, imageUrl: '/assets/mugs.jpg' },
      { id: 4, name: 'Milk Frother', price: 39.99, imageUrl: '/assets/frother.jpeg' },
      { id: 5, name: 'Phone Sillicone Case', price: 5.00, imageUrl: '/assets/phone-case.jpeg' },
      { id: 6, name: 'Basketball', price: 50.00, imageUrl: '/assets/basketball.jpg' },
    ];
  }
}
