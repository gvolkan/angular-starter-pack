import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { AppFormService } from './../../services/app.form.service';
import { AppStateService } from './../../services/app.state.service';
import { AppInfoService } from './../../services/app.info.service';
import { AppTranslateService } from './../../services/app.translate.service';
import { AppLogService } from './../../services/app.log.service';

import { AppLogSourceDirectory } from './../../helpers/log.helper';

import { User } from './../../data/models/user';

@Component({
    moduleId: module.id.toString(),
    selector: 'login',
    templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {

    private authUser: User;
    private authProgress: boolean = false;
    private authUserForm: FormGroup;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private appFormService: AppFormService,
        private appInfoService: AppInfoService,
        private appTranslateService: AppTranslateService,
        private appStateService: AppStateService,
        private appLogService: AppLogService
    ) {
        this.authUser = new User();
        this.prepareForm();
    }

    ngOnInit() {
        if (this.appStateService.authUserData) {
            this.router.navigate(['/home']);
        }
    }

    prepareForm(): void {
        this.authUserForm = this.formBuilder.group({
            'username': [this.authUser.username, [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(50),
            ]],
            'password': [this.authUser.password, [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(50),
            ]]
        });
        this.authUserForm.valueChanges.subscribe(data => this.initFormValueChanged(data));
        this.initFormValueChanged();
    }

    initFormValueChanged(data?: any) {
        this.appFormService.onFormValueChanged(this.authUserForm,
            this.formValidationCriterias,
            this.formErrors,
            data);
    }

    formErrors = {
        'username': '',
        'password': ''
    };

    formValidationCriterias = {
        username: {
            required: [],
            minlength: [3],
            maxlength: [50],
        },
        password: {
            required: [],
            minlength: [3],
            maxlength: [50],
        }
    };

    logIn() {
        if (this.appFormService.validateForm(this.authUserForm,
            this.formValidationCriterias,
            this.formErrors)) {
            this.authProgress = true;
            this.appStateService.signIn(this.authUser.username, this.authUser.password)
                .then(result => {
                    this.authProgress = false;
                    this.authUser.username = '';
                    this.authUser.password = '';
                    if (result !== undefined) {
                        let rurl = '';
                        this.route.queryParams.forEach((params: Params) => {
                            rurl = params['rurl'];
                        });
                        if (rurl === '' || rurl === undefined) {
                            this.router.navigate(['/home']);
                        } else if (rurl !== '' && rurl.indexOf('.') < 0) {
                            this.router.navigate(['/' + rurl]);
                        }
                    } else {
                        this.appInfoService.showSnackBar(
                            this.appTranslateService.getTranslation('APP_COMPONENT_LOGIN.OUTPUT_LOGIN_FAILURE'));
                    }
                })
                .catch(error => { this.appLogService.handleError(AppLogSourceDirectory.LOGIN_COMPONENT, error); });
        } else {
            this.appInfoService.showSnackBar(this.appFormService.getFormValidationMessages(this.formErrors));
        }
    }
}