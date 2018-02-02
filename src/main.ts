import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from '@environments/environment';
import 'hammerjs';

if (environment.production) {
    enableProdMode();
}

window['isUpdateAvailable'] = new Promise(function (resolve, reject) {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {

            console.log('Service worker registered');

            registration.onupdatefound = () => {
                const installingWorker = registration.installing;
                installingWorker.onstatechange = () => {
                    switch (installingWorker.state) {
                        case 'installed':
                            if (navigator.serviceWorker.controller) {
                                // new update available
                                resolve(true);
                            } else {
                                // no update available
                                resolve(false);
                            }
                            break;
                    }
                };
            };
        }).catch(err => {
            console.error('[Service worker error]', err);
        });
    }
});

window['isUpdateAvailable']
    .then(isAvailable => {
        if (isAvailable) {
            console.log('Update available');
        }
        else {
            console.log('No updates');
        }
    });

platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.log(err));
