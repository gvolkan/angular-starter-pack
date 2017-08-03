import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { AppLogSourceDirectory } from './../helpers/log.helper';

@Injectable()
export class AppLogService {

    constructor() { }

    handleError(source: AppLogSourceDirectory, error: any) {
        console.error('ERROR', source.toString(), error);
        return Promise.reject(error.message || error);
    }

    handleErrorObservable(source: AppLogSourceDirectory, error: any) {
        console.error('ERROR', source.toString(), error);
        return Observable.throw(error.message || error);
    }

    handleErrorSingle(source: AppLogSourceDirectory, error: any) {
        console.error('ERROR', source.toString(), error);
    }

}