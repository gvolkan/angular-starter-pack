import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { TranslateService } from '@ngx-translate/core';
import * as _object from "lodash/object";

@Injectable()
export class AppTranslateService {

    private currentLanguage: string = 'en';
    private translations: any = {};

    constructor(
        private translateService: TranslateService,
        private http: Http
    ) {
        this.translateService.addLangs(['en', 'de']);
        this.translateService.setDefaultLang(this.currentLanguage);
        this.translateService.use(this.currentLanguage);

        // AUTO-DETECT BROWSER LANGUAGE
        this.currentLanguage = this.translateService.getBrowserLang().match(/en|de/) ? this.translateService.getBrowserLang() : this.currentLanguage;
        //this.translateService.use(this.currentLanguage);
    }

    translate(key: string, callback: (result: string) => void) {
        this.translateService.get(key).subscribe((translation: string) => {
            callback(translation);
        });
    }

    getTranslation(findKey: string) {
        let result: string = '';
        _object.forIn(this.translations, function (translation, translationKey) {
            if (translationKey === findKey) {
                result = translation;
            }
        });
        return result;
    }

    initTranslations(): Promise<any> {
        const thisRef = this;
        return this.http.get('/assets/i18n/' + this.currentLanguage + '.json')
            .map(res => res.json())
            .toPromise()
            .then(foundTranslations => {
                _object.forIn(foundTranslations, function (translationGroup, translationGroupKey) {
                    _object.forIn(translationGroup, function (translation, translationKey) {
                        let newKey = translationGroupKey + '.' + translationKey;
                        thisRef.translations[newKey] = translation;
                    });
                });
                return this.translations;
            });
    }
}