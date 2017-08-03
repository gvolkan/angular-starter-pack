import {
  browser,
  //by,
  //element
} from 'protractor';
// import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";
import * as chaiAsPromise from "chai-as-promised";
import * as chai from "chai";
// const should = chai.should();
const expect = chai.expect;
// const assert = chai.assert;
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
chai.use(chaiAsPromise);
chai.use(sinonChai);

const baseUrl: string = 'http://localhost:' + process.env.APP_SERVER_PORT;

describe('App - EXAMPLE E2E TESTS', () => {

  beforeEach(() => {
    browser.get('/');
    browser.waitForAngularEnabled(true);
    browser.waitForAngular();
  });

  it(`Default route '/' should return HTML file`,
    (done) => {
      chai.request(baseUrl)
        .get('/')
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          expect(res).to.have.header('content-type', 'text/html; charset=UTF-8');
          done();
        });
    });

  it(`Api route '/api/users/auth/status' should return '{ status: false }'`,
    (done) => {
      chai.request(baseUrl)
        .get('/api/users/auth/status')
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body.status).to.be.false;
          done();
        });
    });

  it(`GraphQL Api route '/api/graphql?query={users{name,username,email}}' should return list of users`,
    (done) => {
      chai.request(baseUrl)
        .get('/api/graphql?query={users{name,username,email}}')
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body.data.users).to.have.length(1);
          done();
        });
    });

});