import { Injectable } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import './../helpers/string.helper';
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
        this.formValidationMessages.forEach(element => {
            if (element[0] === name) {
                for (const crtGroup in criterias) {
                    if (criterias.hasOwnProperty(crtGroup)) {
                        if (field === crtGroup) {
                            for (const crt in criterias[crtGroup]) {
                                if (criterias[crtGroup].hasOwnProperty(crt)) {
                                    if (crt === name) {
                                        let criteriaWithPrefix = [field.capitalize()];
                                        criterias[crtGroup][crt].forEach(element => {
                                            criteriaWithPrefix.push(element);
                                        });
                                        message = element[1].format(criteriaWithPrefix);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        return message;
    }

    getFormValidationMessages(formErrors: any) {
        let messages = '';
        for (const field in formErrors) {
            if (formErrors.hasOwnProperty(field)) {
                if (formErrors[field] !== '') {
                    messages += formErrors[field] + ' ';
                }
            }
        }
        return messages;
    }

    onFormValueChanged(itemForm: FormGroup, criterias: any, formErrors: any, data?: any) {
        if (!itemForm) { return; }
        const form = itemForm;
        for (const field in formErrors) {
            if (formErrors.hasOwnProperty(field)) {
                formErrors[field] = '';
                const control = form.get(field);
                if (control) {
                    if (itemForm.errors != null && itemForm.errors[field] != null) {
                        for (const key in itemForm.errors) {
                            if (itemForm.errors.hasOwnProperty(key)) {
                                formErrors[key] += itemForm.errors[key] + ' ';
                            }
                        };
                    }
                    if (control && !control.valid) {
                        for (const key in control.errors) {
                            if (control.errors.hasOwnProperty(key) && key.indexOf("zone") <= 1) {
                                if (field === key) {
                                    formErrors[field] += control.errors[key] + ' ';
                                } else {
                                    formErrors[field] += this.getFormValidationMessage(control, field, key, criterias) + ' ';
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    validateForm(itemForm: FormGroup, criterias: any, formErrors: any): boolean {
        this.onFormValueChanged(itemForm, criterias, formErrors);
        for (const field in formErrors) {
            if (formErrors.hasOwnProperty(field)) {
                if (formErrors[field] !== '') {
                    return false;
                }
            }
        }
        return true;
    }
}