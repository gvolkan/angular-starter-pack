import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { AppLogService } from "./../../services/app.log.service";
import { AppLogSourceDirectory } from './../../helpers/log.helper';

@Injectable()
export class UserService {

    private apiEndpoint = '/api/users';
    private apiHeaders = new Headers({
        'Content-Type': 'application/json'
    });

    constructor(
        private http: Http,
        private appLogService: AppLogService
    ) { }

    logIn(username: string, password: string): Promise<any> {
        let body = {
            username: username,
            password: password
        };
        return this.http
            .post(this.apiEndpoint + "/auth/login", JSON.stringify(body), { headers: this.apiHeaders })
            .toPromise()
            .then(response => this.handleResponse(response))
            .catch(error => this.handleErrors(error));
    }

    logOut(): Promise<any> {
        let body = {};
        return this.http
            .post(this.apiEndpoint + "/auth/logout", JSON.stringify(body), { headers: this.apiHeaders })
            .toPromise()
            .then(response => this.handleResponse(response))
            .catch(error => this.handleErrors(error));
    }

    getUserStatus(): Promise<any> {
        let url = `${this.apiEndpoint}/auth/status`;
        return this.http.get(url)
            .toPromise()
            .then(response => this.handleResponse(response))
            .catch(error => this.handleErrors(error));
    }

    private handleResponse(response: any) {
        if (response.text() !== "" && response.text() !== undefined) {
            return response.json();
        } else {
            return null;
        }
    }

    private handleErrors(error: any) {
        return this.appLogService.handleError(AppLogSourceDirectory.USER_SERVICE, error);
    }
}