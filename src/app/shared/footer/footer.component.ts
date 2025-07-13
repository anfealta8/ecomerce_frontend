import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para componentes standalone

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule], // Importa CommonModule para directivas como *ngIf, *ngFor, etc.
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
}
