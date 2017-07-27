import { Injectable } from '@angular/core';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';

import { AppTranslateService } from './app.translate.service';

@Injectable()
export class AppInfoService {

    private staticSnackBarConfig = new MdSnackBarConfig();
    private snackBarConfig = new MdSnackBarConfig();

    constructor(
        private snackBar: MdSnackBar,
        private appTranslateService: AppTranslateService) {

        this.staticSnackBarConfig.duration = 0;
        this.snackBarConfig.duration = 5000;
    }

    showSnackBar(message: string) {
        this.snackBar.open(message, this.appTranslateService.getTranslation('APP_INFO_SERVICE.SNACKBAR_ACTION_BUTTON_CLOSE'), this.snackBarConfig);
    }

    showSnackBarStatic(message: string) {
        this.snackBar.open(message, this.appTranslateService.getTranslation('APP_INFO_SERVICE.SNACKBAR_ACTION_BUTTON_CLOSE'), this.staticSnackBarConfig);
    }
}