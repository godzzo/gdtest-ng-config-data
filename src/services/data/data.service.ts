import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from 'services/config/config.service';

@Injectable({
  providedIn: 'root'
})
export class DataService implements Resolve<any>
{
  routeParams: any;
  record: any;
  onChanged: BehaviorSubject<any>;

  constructor(
    private _httpClient: HttpClient,
    private _configService: ConfigService
  ) {
    this.onChanged = new BehaviorSubject({});
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<any> | Promise<any> | any {
    this.routeParams = route.params;

    return this.getRecord();
  }

  getRecord(): Observable<any> {
    if (this.routeParams.id === 'new') {
      this.onChanged.next(false);

      return of(false);
    } else {
      const request$ = this._httpClient.get('api/e-commerce-actors/get/' + this.routeParams.id);

      request$.pipe(map(response => {
        this.record = response[0];
        this.onChanged.next(this.record);
      }));

      return request$;
    }
  }

  saveRecord(record): Observable<any> {
    return this._httpClient.post('api/e-commerce-actors/modify', record);
  }

  addRecord(record): Observable<any> {
    return this._httpClient.post('api/e-commerce-actors/create', record);
  }

  getRecords(name: string, pageIndex: number, pageSize: number, sort: string, sortDir: string): Observable<any> {
    const skip = pageIndex * pageSize;
    const take = pageSize;

    const [requestUrl, options] = this.prepareGetRecordsRequest(
      name, skip, take, sort, sortDir);

    console.log(requestUrl);

    return this._httpClient.get(requestUrl);
  }

  prepareGetRecordsRequest(name: string, skip: number, take: number, order: string, orderDirection: string): [string, any] {
    const requestUrl =
      `http://localhost:3000/${name}/findAndCount?` +
      `skip=${skip}&take=${take}&order=${order}&orderDir=${orderDirection}`;

    return [requestUrl, null];
  }
}
