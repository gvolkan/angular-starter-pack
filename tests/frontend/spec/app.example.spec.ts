import {
    async,
    //inject,
    ComponentFixture,
    TestBed
} from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";
import * as chaiAsPromise from "chai-as-promised";
import * as chai from "chai";
const should = chai.should();
const expect = chai.expect;
//const assert = chai.assert;
chai.use(chaiAsPromise);
chai.use(sinonChai);

import { AppComponent } from './../../../src/frontend/app/app.component';
import { AppModule } from './../../../src/frontend/app/app.module';

describe(`App - EXAMPLE ANGULAR TESTS`, () => {
    let component: AppComponent;
    let componentFixture: ComponentFixture<AppComponent>;
    let server = sinon.fakeServer.create();

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            imports: [
                AppModule,
                RouterTestingModule.withRoutes([])
            ],
            declarations: [],
            providers: [
                { provide: APP_BASE_HREF, useValue: '/' }
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        componentFixture = TestBed.createComponent(AppComponent);
        component = componentFixture.componentInstance;
        componentFixture.detectChanges();

        server.respondWith("GET", "/api/auth/user/status",
            [
                200,
                { "Content-Type": "application/json" },
                '{ "data": { "id": 1, "username": "admin", "roles": "ADMIN" } }'
            ]);

    });

    it(`'AppComponent' should be initialized`, () => {
        should.exist(componentFixture);
        should.exist(component);
    });

    it(`'AppComponent' should have checkStatus method`, () => {
        should.exist(AppComponent.prototype.checkStatus);
    });

    it(`'AppComponent' checkStatus method should navigate to login`, () => {
        let component = componentFixture.componentInstance;
        let routeSpy = sinon.spy((<any>component).router, 'navigate');
        component.checkStatus();
        expect(routeSpy).to.be.calledWith(['/login']);
    });

});