import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class TokenInterceptor implements TokenInterceptor {

    constructor(public afAuth: AngularFireAuth) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // first() operator is required as to avoid duplicate requests on emmission of another idToken
        return this.afAuth.idToken.first().flatMap(idToken => {
            if (idToken) {

                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${idToken}`
                    }
                });
            }

            return next.handle(request);
        });
    }
}
