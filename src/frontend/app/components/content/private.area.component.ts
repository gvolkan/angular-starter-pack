import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AppStateService } from './../../services/app.state.service';

@Component({
    moduleId: module.id.toString(),
    selector: 'private-area',
    templateUrl: 'private.area.component.html'
})

export class PrivateAreaComponent {

    constructor(
        private router: Router,
        private appStateService: AppStateService
    ) {
        if (!this.appStateService.authUserData) {
            const navExtras: any = {
                queryParams: { "rurl": "private-area"}
            };
            this.router.navigate(['/login'], navExtras);
        }
    }
}