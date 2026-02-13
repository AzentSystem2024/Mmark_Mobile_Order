import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { importProvidersFrom } from '@angular/core';
import { provideServiceWorker, SwUpdate } from '@angular/service-worker';

import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app/app.routes';
import { isDevMode } from '@angular/core';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    // ⭐ Add this line → Hash Routing Fix for IIS Refresh 404
    provideRouter(routes, withHashLocation()),

    // Toastr working setup
    importProvidersFrom(
      BrowserAnimationsModule,
      ToastrModule.forRoot({
        timeOut: 3000,
        positionClass: 'toast-top-right',
        preventDuplicates: true,
      }),
    ),

    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
})
  .then((appRef) => {
    const updates = appRef.injector.get(SwUpdate);

    if (updates.isEnabled) {
      updates.versionUpdates.subscribe((event) => {
        if (event.type === 'VERSION_READY') {
          updates.activateUpdate().then(() => {
            document.location.reload();
          });
        }
      });
    }
  })
  .catch((err) => console.error(err));
