import { Injectable } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import './../helpers/string.helper';
import * as _object from "lodash/object";

import { AppTranslateService } from './app.translate.service';

@Injectable()
export class AppFormService {

    private formValidationMessages: Array<[string, string]> = [];

    constructor(private appTranslateService: AppTranslateService) { }

    setFormValidationMessages() {
        this.formValidationMessages = [];
        this.formValidationMessages = this.formValidationMessages.concat([['required',
            this.appTranslateService.getTranslation('APP_FORM_VALIDATION.REQUIRED')
        ]]);
        this.formValidationMessages = this.formValidationMessages.concat([['minlength',
            this.appTranslateService.getTranslation('APP_FORM_VALIDATION.MIN_LENGTH')
        ]]);
        this.formValidationMessages = this.formValidationMessages.concat([['maxlength',
            this.appTranslateService.getTranslation('APP_FORM_VALIDATION.MAX_LENGTH')
        ]]);
    }

    getFormValidationMessage(control: AbstractControl, field: string, name: string, criterias: any) {
        let message = '';
        this.formValidationMessages.forEach(validationMessage => {
            if (validationMessage[0] === name) {
                _object.forIn(criterias, function (crtGroup, crtGroupKey) {
                    if (field === crtGroupKey) {
                        _object.forIn(crtGroup, function (crt, crtKey) {
                            if (crtKey === name) {
                                let criteriaWithPrefix = [field.capitalize()];
                                crt.forEach(values => {
                                    criteriaWithPrefix.push(values);
                                });
                                message = validationMessage[1].format(criteriaWithPrefix);
                            }
                        });
                    }
                });
            }
        });
        return message;
    }

    getFormValidationMessages(formErrors: any) {
        let messages = '';
        _object.forIn(formErrors, function (formError, formErrorKey) {
            if (formError !== '') {
                messages += formError + ' ';
            }
        });
        return messages;
    }

    onFormValueChanged(itemForm: FormGroup, criterias: any, formErrors: any, data?: any) {
        if (!itemForm) { return; }
        const form = itemForm;
        const thisRef = this;

        _object.forIn(formErrors, function (formError, formErrorKey) {
            formErrors[formErrorKey] = '';
            const control = form.get(formErrorKey);
            if (control) {
                if (itemForm.errors != null && itemForm.errors[formErrorKey] != null) {
                    _object.forIn(itemForm.errors, function (itemFormError, itemFormErrorKey) {
                        formErrors[itemFormErrorKey] += itemFormError + ' ';
                    });
                }
                if (control && !control.valid) {
                    _object.forIn(control.errors, function (controlError, controlErrorKey) {
                        if (formErrorKey === controlErrorKey) {
                            formErrors[formErrorKey] += controlError + ' ';
                        } else {
                            formErrors[formErrorKey] += thisRef.getFormValidationMessage(control, formErrorKey, controlErrorKey, criterias) + ' ';
                        }
                    });
                }
            }
        });
    }

    validateForm(itemForm: FormGroup, criterias: any, formErrors: any): boolean {
        this.onFormValueChanged(itemForm, criterias, formErrors);
        let status: boolean = true;
        _object.forIn(formErrors, function (formError, formErrorKey) {
            if (formError !== '') {
                status = false;
            }
        });
        return status;
    }
}