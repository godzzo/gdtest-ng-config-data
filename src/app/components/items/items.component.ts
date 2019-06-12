import { Component, OnInit } from '@angular/core';

import { map } from 'rxjs/operators';

import { ConfigService } from 'services/config/config.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.sass']
})
export class ItemsComponent implements OnInit {

  constructor(private _configService: ConfigService) {
    _configService.get('first')
      .pipe(
        map(req => {
          console.log('config arrived - map', req);

          return req;
        })
      ).subscribe(req => {
        console.log('hot observer invoked by subscribe :)', req);
      });
  }

  ngOnInit() {
  }

}
