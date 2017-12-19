import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

export interface Notification {
    message: string,
    action?: string,
    duration?: number
}

@Injectable()
export class GeneralNotificationsService {

    private notificationSource = new Subject<Notification>();
    public broadcast = this.notificationSource.asObservable();
    private readonly messageDelay = 300;

    private readonly defaultDuration = 2000;

    constructor() {
    }

    public sendUpdateNotification(entity: string) {

        entity = this.capitalizeFirstLetter(entity);

        const notification: Notification = {
            message: `${entity} updated`,
            duration: this.defaultDuration
        };

        setTimeout(() => {
            this.notificationSource.next(notification);
        }, this.messageDelay);
    }

    public sendCreateNotification(entity: string) {

        entity = this.capitalizeFirstLetter(entity);

        const notification: Notification = {
            message: `${entity} added`,
            duration: this.defaultDuration
        };

        setTimeout(() => {
            this.notificationSource.next(notification);
        }, this.messageDelay);
    }

    public sendDeleteNotification(entity: string) {

        entity = this.capitalizeFirstLetter(entity);

        const notification: Notification = {
            message: `${entity} delete`,
            duration: this.defaultDuration
        };

        setTimeout(() => {
            this.notificationSource.next(notification);
        }, this.messageDelay);
    }

    private capitalizeFirstLetter(s: string) {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

}
