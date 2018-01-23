import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import "rxjs/add/operator/timeout";
import 'rxjs/add/operator/map';

@Injectable()
export class AuthProvider {

  constructor(public http: Http) {
    // console.log('Hello AuthProvider Provider');
  }

  authenticate(user): Observable<any> {
    var creds = {
      usercode: user.username,
      password: user.password
    };
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://spcapi.sahapatonline.com/login', creds, { headers: headers })
      .timeout(5000)
      .map((res) => {
        console.log('res', res);
        return <any>(res.json().users);
      });
  }

}
