import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    registry: any = {};

    constructor(
        private _httpClient: HttpClient
    )
    {
    }

    get(name: string): Observable<any> {
        if (this.registry[name]) {
            return of(this.registry[name]);
        } else {
            return this.request(name)
                .pipe(
                    map(resp => {
                        this.registry[name] = resp;

                        return resp;
                    }),
                    catchError(err => {
                        console.log(err);

                        return of([]);
                    })
                )
            ;
        }
    }

    request(name: string): Observable<any> {
        const [requestUrl, options] = this.prepareRequest(name);

        console.log(requestUrl);

        return this._httpClient.get(requestUrl);
    }

    prepareRequest(name: string): [string, any] {
        const requestUrl =
           `/assets/data/${name}.config.json`;

        return [requestUrl, null];
    }
}
