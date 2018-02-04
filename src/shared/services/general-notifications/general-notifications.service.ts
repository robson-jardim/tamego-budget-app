import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { EntityNames } from '@shared/enums/entity-names.enum';

export interface Notification {
    message: string;
    action?: string;
    duration?: number;
}

@Injectable()
export class GeneralNotificationsService {

    private notificationSource = new Subject<Notification>();
    public broadcast = this.notificationSource.asObservable();
    private readonly messageDelay = 0;

    private readonly defaultDuration = 2000;

    constructor() {
    }

    public sendUpdateNotification(entity: EntityNames) {
        const notification: Notification = {
            message: `${entity} updated`,
            duration: this.defaultDuration
        };

        setTimeout(() => {
            this.notificationSource.next(notification);
        }, this.messageDelay);
    }

    public sendCreateNotification(entity: EntityNames) {
        const notification: Notification = {
            message: `${entity} added`,
            duration: this.defaultDuration
        };

        setTimeout(() => {
            this.notificationSource.next(notification);
        }, this.messageDelay);
    }

    public sendDeleteNotification(entity: EntityNames) {
        const notification: Notification = {
            message: `${entity} deleted`,
            duration: this.defaultDuration
        };

        setTimeout(() => {
            this.notificationSource.next(notification);
        }, this.messageDelay);
    }

    public sendErrorNotification() {
        const notification: Notification = {
            message: `Error`,
            duration: this.defaultDuration
        };

        setTimeout(() => {
            this.notificationSource.next(notification);
        }, this.messageDelay);
    }
}
