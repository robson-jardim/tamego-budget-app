import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from '@environments/environment';
import 'hammerjs';

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
    // If the service work is registered in index it's going to immediately start trying
    // to download all the assets that it needs to make this application work offline
    // but that will happen while the app is loading and so we'll have two kind of
    // different uses of the network competing with each other and will slow down the
    // initial load

    // Wait for angular to finish bootstrapping
    // and then register the service worker
    .then(() => registerServiceWorker())
    .catch(err => console.log(err));

function registerServiceWorker() {
    // Taken from: https://medium.com/progressive-web-apps/pwa-create-a-new-update-available-notification-using-service-workers-18be9168d717
    window['isUpdateAvailable'] = new Promise(function (resolve, reject) {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js').then(registration => {
                console.log('[SW Registered]');
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
            }).catch(error => {
                console.error('[SW Error]', error);
            });
        }
    });
}
