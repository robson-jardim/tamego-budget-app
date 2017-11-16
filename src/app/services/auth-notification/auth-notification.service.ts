import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

export interface Message {
    content: string;
    type: string;
}

@Injectable()
export class AuthNotificationService {

    private messageSource = new Subject<Message>();
    public messageBroadcast = this.messageSource.asObservable();

    constructor() {
    }

    public update(content: string, type: string) {
        const message: Message = {content, type};
        this.messageSource.next(message);
    }

    clear() {
        this.messageSource.next(null);
    }

}
