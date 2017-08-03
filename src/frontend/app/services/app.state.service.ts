import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/toPromise';

import { AppInfoService } from './app.info.service';
import { AppTranslateService } from './app.translate.service';
import { AppLogService } from './app.log.service';

import { AppLogSourceDirectory } from './../helpers/log.helper';

import { UserService } from './../data/services/user.service';

@Injectable()
export class AppStateService {

    private authUser = new BehaviorSubject<any>(null);

    set authUserData(data: any) {
        this.authUser.next(data);
    }
    get authUserData() {
        return this.authUser.getValue();
    }

    constructor(
        private router: Router,
        private userService: UserService,
        private appInfoService: AppInfoService,
        private appLogService: AppLogService,
        private appTranslateService: AppTranslateService) {
        this.checkUserStatus();
    }

    checkUserStatus() {
        return this.userService.getUserStatus()
            .then(result => {
                if (result.user !== undefined) {
                    this.authUserData = result;
                } else {
                    this.authUserData = null;
                }
                return result;
            })
            .catch(error => { this.appLogService.handleError(AppLogSourceDirectory.APP_STATE_SERVICE, error); });
    }
    signOut() {
        return this.userService.logOut()
            .then(result => {
                if (result !== null && result.status !== null) {
                    if (!result.status) {
                        this.authUserData = null;
                        this.router.navigate(['/home']);
                        this.appInfoService.showSnackBar(
                            this.appTranslateService.getTranslation("APP_COMPONENT.OUTPUT_LOGOUT_SUCCESS"));
                    }
                }
                return result;
            })
            .catch(error => { this.appLogService.handleError(AppLogSourceDirectory.APP_STATE_SERVICE, error); });
    }
    signIn(username: string, password: string): Promise<any> {
        return this.userService.logIn(username, password)
            .then(result => {
                if (result !== undefined && result.user !== undefined) {
                    this.authUserData = result.user;
                }
                return result.user;
            })
            .catch(error => { this.appLogService.handleError(AppLogSourceDirectory.APP_STATE_SERVICE, error); });
    }
}