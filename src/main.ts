import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config'; // Importa tu configuración principal
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));