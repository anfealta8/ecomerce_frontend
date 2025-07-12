// src/app/shared/header/header.component.ts
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router'; // <-- Importa estos

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,         // <-- Añade RouterLink
    RouterLinkActive    // <-- Añade RouterLinkActive
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  // ...
}