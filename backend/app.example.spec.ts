//import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";
import * as chaiAsPromise from "chai-as-promised";
import * as chai from "chai";
const should = chai.should();
// const expect = chai.expect;
// const assert = chai.assert;
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
chai.use(chaiAsPromise);
chai.use(sinonChai);

import { StringHelper } from "./infrastructure/helpers/string.helper";

describe('App - EXAMPLE UNIT TESTS', () => {

  it(`'StringHelper.getRandomCode()' should return string type with length of 6 characters`,
    (done) => {
      const value = StringHelper.getRandomCode();
      value.should.be.string;
      value.should.exist;
      value.should.be.lengthOf(6);
      done();
    });

  it(`'StringHelper.getRandomCode()' should return lowercase string`,
    (done) => {
      const value = StringHelper.getRandomCode(6, true);
      value.should.be.equal(value.toLowerCase());
      done();
    });

  it(`'StringHelper.capitalize()' should capitalize string`, (done) => {
    const value = "working";
    const newValue = value.capitalize();
    newValue.should.be.string;
    newValue.should.be.lengthOf(7);
    newValue.should.be.equal("Working");
    done();
  });

  it(`'StringHelper.format()' should replace {} arguments`, (done) => {
    const value = "{0} is working from {1}.";
    const replacements = ["Jimmy", "home"];
    const newValue = value.format(replacements);
    newValue.should.be.string;
    newValue.should.be.equal("Jimmy is working from home.");
    done();
  });

});