import { Component, AfterViewInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import 'rxjs/add/operator/distinctUntilChanged';

import { AppFormService } from './services/app.form.service';
import { AppInfoService } from './services/app.info.service';
import { AppTranslateService } from './services/app.translate.service';
import { AppStateService } from './services/app.state.service';

//declare const ga: any;

@Component({
    moduleId: module.id.toString(),
    selector: 'app',
    templateUrl: 'app.html'
})

export class AppComponent implements AfterViewInit {

    private userStatus: boolean = false;

    constructor(
        private titleService: Title,
        private router: Router,
        private appFormService: AppFormService,
        private appInfoService: AppInfoService,
        private appTranslateService: AppTranslateService,
        private appStateService: AppStateService
    ) {
        this.appTranslateService.initTranslations().then(() => {
            return this.appFormService.setFormValidationMessages();
        });

        // TODO: SET PAGE TITLE PROGRAMMATICALLY
        this.titleService.setTitle("Angular Starter Pack");
        this.userStatus = this.appStateService.authUserData ? true : false;
    }

    ngAfterViewInit() {
        // TODO: UNCOMMENT AND INSERT GOOGLE ANALYTICS CODE TO ENABLE GOOGLE ANALYTICS
        //ga('create', "---> GOOGLE ANALYTICS CODE <---", 'auto');
        //ga('send', 'pageview', this.router.url);
        this.router.events.distinctUntilChanged((previous: any, current: any) => {
            return current instanceof NavigationEnd ? previous.url === current.url : true;
        }).subscribe((x: any) => {
            //ga('send', 'pageview', x.url);
        });
    }

    checkStatus() {
        if (this.appStateService.authUserData) {
            return this.appStateService.signOut().then(result => {
                this.appInfoService.showSnackBar(
                    this.appTranslateService.getTranslation("APP_COMPONENT.OUTPUT_LOGOUT_SUCCESS"));
                return this.router.navigate(['/login']);
            });
        } else {
            return this.router.navigate(['/login']);
        }
    }
}