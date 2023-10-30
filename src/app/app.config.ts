import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpAdapter } from 'src/infrastructure/adapters/HttpAdapter';

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimations(),
        provideAnimations(),
        provideHttpClient(),
        HttpAdapter,
    ],
};
