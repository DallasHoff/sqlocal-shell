import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './routes/app.component';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './routes/app.routes';

const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
  ],
};

bootstrapApplication(AppComponent, appConfig).catch((err) => {
  console.error(err);
});
