import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { TranslateService } from '@ngx-translate/core';

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
        for (const key in this.translations) {
            if (this.translations.hasOwnProperty(key)) {
                if (findKey === key) {
                    return this.translations[key];
                }
            }
        }
        return '';
    }

    initTranslations(): Promise<any> {
        return this.http.get('/assets/i18n/' + this.currentLanguage + '.json')
            .map(res => res.json())
            .toPromise()
            .then(foundTranslations => {
                for (const groupKey in foundTranslations) {
                    if (foundTranslations.hasOwnProperty(groupKey)) {
                        for (const key in foundTranslations[groupKey]) {
                            if (foundTranslations[groupKey].hasOwnProperty(key)) {
                                let newKey = groupKey + '.' + key;
                                let newValue = foundTranslations[groupKey][key];
                                this.translations[newKey] = newValue;
                            }
                        }
                    }
                }
                return this.translations;
            });
    }
}