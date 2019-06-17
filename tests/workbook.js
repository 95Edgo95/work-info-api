"use strict";

const { FAIL_STATUS_MESSAGE, NOT_ALLOWED, PERMISSION_DENIED, SUCCESS_STATUS_MESSAGE, UNAUTHORIZED, VALIDATION_ERROR } = require("../dist/configs/response-messages");
const { CREATED_CODE, FORBIDDEN_CODE, NO_CONTENT_CODE, UNAUTHORIZED_CODE, VALIDATION_ERROR_CODE, NOT_FOUND_CODE, SUCCESS_CODE } = require("../dist/configs/status-codes");
const WorkbookService = require("../dist/api/modules/workbook/WorkbookService").default;
const params = require("../dist/configs/params").default;
const chaiHttp = require("chai-http");
const jwt = require("jsonwebtoken");
const chai = require("chai");

const expect = chai.expect;
const should = chai.should();

chai.use(chaiHttp);

describe("Workbook Module", () => {
  let csrf, cookies;

  before((done) => {
    chai.request(params._apiUrl)
      .get("/auth/get-csrf")
      .set("origin", params._appUrl)
      .end((err, res) => {
        csrf = res.body.csrf;
        cookies = res.headers["set-cookie"];
        done();
      });
  });

  describe("/workbooks POST(create workbook)", () => {
    const adminUserID = 1,
      viewerUserID = 2;

    let workbookId = null;

    let adminValidToken,
      adminExpiredToken,
      viewerToken,
      invalidToken;

    before((done) => {
      invalidToken = "asdfasdfasdf";
      adminValidToken = jwt.sign({ id: adminUserID }, params.tokenSecret, { expiresIn: 900 });
      adminExpiredToken = jwt.sign({ id: adminUserID }, params.tokenSecret, { expiresIn: 0 });
      viewerToken = jwt.sign({ id: viewerUserID }, params.tokenSecret, { expiresIn: 900 });
      done();
    });

    it("it should give invalid csrf error for missing cookies", done => {
      chai.request(params._apiUrl)
        .post("/workbooks/")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("Authorization", `Bearer ${adminValidToken}`)
        .send({
          firstName: "FirstNameTest",
          lastName: "LastNameTest",
          email: "test3@test.com",
          passport: "AM45687231",
          birthDate: "3/6/1990"
        })
        .end((err, res) => {
          res.should.have.status(FORBIDDEN_CODE);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          res.body.message.should.be.equal("invalid csrf token");
          expect(res.body.data).to.be.null;
          expect(res.body.errors).to.be.null;
          done();
        });
    });

    it("it should give invalid csrf error for missing header", done => {
      chai.request(params._apiUrl)
        .post("/workbooks/")
        .set("origin", params._appUrl)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${adminValidToken}`)
        .send({
          firstName: "FirstNameTest",
          lastName: "LastNameTest",
          email: "test3@test.com",
          passport: "AM45687231",
          birthDate: "3/6/1990"
        })
        .end((err, res) => {
          res.should.have.status(FORBIDDEN_CODE);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          res.body.message.should.be.equal("invalid csrf token");
          expect(res.body.data).to.be.null;
          expect(res.body.errors).to.be.null;
          done();
        });
    });

    it("it should give authorization error for missing header", done => {
      chai.request(params._apiUrl)
        .post("/workbooks/")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .send({
          firstName: "FirstNameTest",
          lastName: "LastNameTest",
          email: "test3@test.com",
          passport: "AM45687231",
          birthDate: "3/6/1990"
        })
        .end((err, res) => {
          res.should.have.status(UNAUTHORIZED_CODE);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          res.body.message.should.be.equal(UNAUTHORIZED);
          expect(res.body.data).to.be.null;
          expect(res.body.errors).to.be.null;
          done();
        });
    });

    it("it should give authorization error for expired token", done => {
      chai.request(params._apiUrl)
        .post("/workbooks/")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${adminExpiredToken}`)
        .send({
          firstName: "FirstNameTest",
          lastName: "LastNameTest",
          email: "test3@test.com",
          passport: "AM45687231",
          birthDate: "3/6/1990"
        })
        .end((err, res) => {
          res.should.have.status(UNAUTHORIZED_CODE);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          res.body.message.should.be.equal(UNAUTHORIZED);
          expect(res.body.data).to.be.null;
          expect(res.body.errors).to.be.null;
          done();
        });
    });

    it("it should give authorization error for invalid token", done => {
      chai.request(params._apiUrl)
        .post("/workbooks/")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${invalidToken}`)
        .send({
          firstName: "FirstNameTest",
          lastName: "LastNameTest",
          email: "test3@test.com",
          passport: "AM45687231",
          birthDate: "3/6/1990"
        })
        .end((err, res) => {
          res.should.have.status(UNAUTHORIZED_CODE);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          res.body.message.should.be.equal(UNAUTHORIZED);
          expect(res.body.data).to.be.null;
          expect(res.body.errors).to.be.null;
          done();
        });
    });

    it("it should give permission error to viewer", done => {
      chai.request(params._apiUrl)
        .post("/workbooks/")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${viewerToken}`)
        .send({
          firstName: "FirstNameTest",
          lastName: "LastNameTest",
          email: "test3@test.com",
          passport: "AM45687231",
          birthDate: "3/6/1990"
        })
        .end((err, res) => {
          res.should.have.status(FORBIDDEN_CODE);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          res.body.message.should.be.equal(PERMISSION_DENIED);
          expect(res.body.data).to.be.null;
          res.body.errors.should.not.be.null;
          res.body.errors.message.should.be.equal(NOT_ALLOWED);
          done();
        });
    });

    it("it should give validation error for missing firstName", done => {
      chai.request(params._apiUrl)
        .post("/workbooks/")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${adminValidToken}`)
        .send({
          lastName: "LastNameTest",
          email: "test3@test.com",
          passport: "AM45687231",
          birthDate: "3/6/1990"
        })
        .end((err, res) => {
          res.should.have.status(VALIDATION_ERROR_CODE);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          res.body.message.should.be.equal(VALIDATION_ERROR);
          expect(res.body.data).to.be.null;
          res.body.errors.should.not.be.null;
          res.body.errors.firstName.should.not.be.null;
          done();
        });
    });

    it("it should give validation error for invalid firstName", done => {
      chai.request(params._apiUrl)
        .post("/workbooks/")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${adminValidToken}`)
        .send({
          firstName: "asd 5456 asf",
          lastName: "LastNameTest",
          email: "test3@test.com",
          passport: "AM45687231",
          birthDate: "3/6/1990"
        })
        .end((err, res) => {
          res.should.have.status(VALIDATION_ERROR_CODE);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          res.body.message.should.be.equal(VALIDATION_ERROR);
          expect(res.body.data).to.be.null;
          res.body.errors.should.not.be.null;
          res.body.errors.firstName.should.not.be.null;
          done();
        });
    });

    it("it should give validation error for missing lastName", done => {
      chai.request(params._apiUrl)
        .post("/workbooks/")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${adminValidToken}`)
        .send({
          firstName: "FirstNameTest",
          email: "test3@test.com",
          passport: "AM45687231",
          birthDate: "3/6/1990"
        })
        .end((err, res) => {
          res.should.have.status(VALIDATION_ERROR_CODE);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          res.body.message.should.be.equal(VALIDATION_ERROR);
          expect(res.body.data).to.be.null;
          res.body.errors.should.not.be.null;
          res.body.errors.lastName.should.not.be.null;
          done();
        });
    });

    it("it should give validation error for invalid lastName", done => {
      chai.request(params._apiUrl)
        .post("/workbooks/")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${adminValidToken}`)
        .send({
          firstName: "FirstNameTest",
          lastName: "as 34 fsfs",
          email: "test3@test.com",
          passport: "AM45687231",
          birthDate: "3/6/1990"
        })
        .end((err, res) => {
          res.should.have.status(VALIDATION_ERROR_CODE);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          res.body.message.should.be.equal(VALIDATION_ERROR);
          expect(res.body.data).to.be.null;
          res.body.errors.should.not.be.null;
          res.body.errors.lastName.should.not.be.null;
          done();
        });
    });

    it("it should give validation error for missing email", done => {
      chai.request(params._apiUrl)
        .post("/workbooks/")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${adminValidToken}`)
        .send({
          firstName: "FirstNameTest",
          lastName: "LastNameTest",
          passport: "AM45687231",
          birthDate: "3/6/1990"
        })
        .end((err, res) => {
          res.should.have.status(VALIDATION_ERROR_CODE);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          res.body.message.should.be.equal(VALIDATION_ERROR);
          expect(res.body.data).to.be.null;
          res.body.errors.should.not.be.null;
          res.body.errors.email.should.not.be.null;
          done();
        });
    });

    it("it should give validation error for invalid email", done => {
      chai.request(params._apiUrl)
        .post("/workbooks/")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${adminValidToken}`)
        .send({
          firstName: "FirstNameTest",
          lastName: "LastNameTest",
          email: "wrong",
          passport: "AM45687231",
          birthDate: "3/6/1990"
        })
        .end((err, res) => {
          res.should.have.status(VALIDATION_ERROR_CODE);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          res.body.message.should.be.equal(VALIDATION_ERROR);
          expect(res.body.data).to.be.null;
          res.body.errors.should.not.be.null;
          res.body.errors.email.should.not.be.null;
          done();
        });
    });

    it("it should give validation error for missing passport", done => {
      chai.request(params._apiUrl)
        .post("/workbooks/")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${adminValidToken}`)
        .send({
          firstName: "FirstNameTest",
          lastName: "LastNameTest",
          email: "test3@test.com",
          birthDate: "3/6/1990"
        })
        .end((err, res) => {
          res.should.have.status(VALIDATION_ERROR_CODE);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          res.body.message.should.be.equal(VALIDATION_ERROR);
          expect(res.body.data).to.be.null;
          res.body.errors.should.not.be.null;
          res.body.errors.passport.should.not.be.null;
          done();
        });
    });

    it("it should give validation error for invalid passport", done => {
      chai.request(params._apiUrl)
        .post("/workbooks/")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${adminValidToken}`)
        .send({
          firstName: "FirstNameTest",
          lastName: "LastNameTest",
          email: "test3@test.com",
          passport: "asdf g#$%^ sd",
          birthDate: "3/6/1990"
        })
        .end((err, res) => {
          res.should.have.status(VALIDATION_ERROR_CODE);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          res.body.message.should.be.equal(VALIDATION_ERROR);
          expect(res.body.data).to.be.null;
          res.body.errors.should.not.be.null;
          res.body.errors.passport.should.not.be.null;
          done();
        });
    });

    it("it should give validation error for missing birthDate", done => {
      chai.request(params._apiUrl)
        .post("/workbooks/")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${adminValidToken}`)
        .send({
          firstName: "FirstNameTest",
          lastName: "LastNameTest",
          email: "test3@test.com",
          passport: "AM45687231"
        })
        .end((err, res) => {
          res.should.have.status(VALIDATION_ERROR_CODE);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          res.body.message.should.be.equal(VALIDATION_ERROR);
          expect(res.body.data).to.be.null;
          res.body.errors.should.not.be.null;
          res.body.errors.birthDate.should.not.be.null;
          done();
        });
    });

    it("it should give validation error for not 18+", done => {
      chai.request(params._apiUrl)
        .post("/workbooks/")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${adminValidToken}`)
        .send({
          firstName: "FirstNameTest",
          lastName: "LastNameTest",
          email: "test3@test.com",
          passport: "AM45687231",
          birthDate: "3/6/2012"
        })
        .end((err, res) => {
          res.should.have.status(VALIDATION_ERROR_CODE);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          res.body.message.should.be.equal(VALIDATION_ERROR);
          expect(res.body.data).to.be.null;
          res.body.errors.should.not.be.null;
          res.body.errors.birthDate.should.not.be.null;
          done();
        });
    });

    it("it should create workbook", done => {
      chai.request(params._apiUrl)
        .post("/workbooks/")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${adminValidToken}`)
        .send({
          firstName: "FirstNameTest",
          lastName: "LastNameTest",
          email: "test3@test.com",
          passport: "AM45687231",
          birthDate: "3/6/1990"
        })
        .end((err, res) => {
          res.should.have.status(CREATED_CODE);
          res.body.status.should.be.equal(SUCCESS_STATUS_MESSAGE);
          expect(res.body.errors).to.be.null;
          res.body.data.should.not.be.null;
          workbookId = res.body.data.workbook.id;
          res.body.data.workbook.should.not.be.null;
          done();
        });
    });

    after((done) => {
      WorkbookService.delete(workbookId)
        .then(() => {
          done();
        })
        .catch((e) => {
          console.dir(e);
          done();
        });
    });
  });

  describe("/workbooks/:id PATCH(update workbook)", () => {
    const adminUserID = 1,
      viewerUserID = 2;

    let workbookId;

    let adminValidToken,
      adminExpiredToken,
      viewerToken,
      invalidToken;

    before((done) => {
      invalidToken = "asdfasdfasdf";
      adminValidToken = jwt.sign({ id: adminUserID }, params.tokenSecret, { expiresIn: 900 });
      adminExpiredToken = jwt.sign({ id: adminUserID }, params.tokenSecret, { expiresIn: 0 });
      viewerToken = jwt.sign({ id: viewerUserID }, params.tokenSecret, { expiresIn: 900 });

      WorkbookService.create({
        firstName: "FirstNameTest",
        lastName: "LastNameTest",
        email: "test3@test.com",
        passport: "AM45687231",
        birthDate: "3/6/1990"
      })
        .then(workbook => {
          workbookId = workbook.id;
          done();
        })
        .catch((e) => {
          console.dir(e);
          done();
        });
    });

    it("it should give invalid csrf error for missing cookies", done => {
      chai.request(params._apiUrl)
        .patch(`/workbooks/${workbookId}`)
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("Authorization", `Bearer ${adminValidToken}`)
        .send({ email: "test4@email.com" })
        .end((err, res) => {
          res.should.have.status(FORBIDDEN_CODE);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          res.body.message.should.be.equal("invalid csrf token");
          expect(res.body.data).to.be.null;
          expect(res.body.errors).to.be.null;
          done();
        });
    });

    it("it should give invalid csrf error for missing header", done => {
      chai.request(params._apiUrl)
        .post(`/workbooks/${workbookId}`)
        .set("origin", params._appUrl)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${adminValidToken}`)
        .send({ email: "test4@email.com" })
        .end((err, res) => {
          res.should.have.status(FORBIDDEN_CODE);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          res.body.message.should.be.equal("invalid csrf token");
          expect(res.body.data).to.be.null;
          expect(res.body.errors).to.be.null;
          done();
        });
    });

    it("it should give authorization error for missing header", done => {
      chai.request(params._apiUrl)
        .patch(`/workbooks/${workbookId}`)
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .send({ email: "test4@email.com" })
        .end((err, res) => {
          res.should.have.status(UNAUTHORIZED_CODE);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          res.body.message.should.be.equal(UNAUTHORIZED);
          expect(res.body.data).to.be.null;
          expect(res.body.errors).to.be.null;
          done();
        });
    });

    it("it should give authorization error for expired token", done => {
      chai.request(params._apiUrl)
        .patch(`/workbooks/${workbookId}`)
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${adminExpiredToken}`)
        .send({ email: "test4@email.com" })
        .end((err, res) => {
          res.should.have.status(UNAUTHORIZED_CODE);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          res.body.message.should.be.equal(UNAUTHORIZED);
          expect(res.body.data).to.be.null;
          expect(res.body.errors).to.be.null;
          done();
        });
    });

    it("it should give authorization error for invalid token", done => {
      chai.request(params._apiUrl)
        .patch(`/workbooks/${workbookId}`)
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${invalidToken}`)
        .send({ email: "test4@email.com" })
        .end((err, res) => {
          res.should.have.status(UNAUTHORIZED_CODE);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          res.body.message.should.be.equal(UNAUTHORIZED);
          expect(res.body.data).to.be.null;
          expect(res.body.errors).to.be.null;
          done();
        });
    });

    it("it should give validation error", done => {
      chai.request(params._apiUrl)
        .patch(`/workbooks/${workbookId}`)
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${adminValidToken}`)
        .send({ email: "sadf" })
        .end((err, res) => {
          res.should.have.status(VALIDATION_ERROR_CODE);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          res.body.message.should.be.equal(VALIDATION_ERROR);
          expect(res.body.data).to.be.null;
          res.body.errors.should.not.be.null;
          res.body.errors.email.should.not.be.null;
          done();
        });
    });

    it("it should give not found", done => {
      chai.request(params._apiUrl)
        .patch("/workbooks/999999")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${adminValidToken}`)
        .send({ email: "test4@mail.com" })
        .end((err, res) => {
          res.should.have.status(NOT_FOUND_CODE);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          expect(res.body.data).to.be.null;
          expect(res.body.errors).to.be.null;
          done();
        });
    });

    it("it should give permission denied to viewer", done => {
      chai.request(params._apiUrl)
        .patch(`/workbooks/${workbookId}`)
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${viewerToken}`)
        .send({ email: "test4@mail.com" })
        .end((err, res) => {
          res.should.have.status(FORBIDDEN_CODE);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          expect(res.body.data).to.be.null;
          res.body.errors.should.not.be.null;
          res.body.errors.message.should.be.equal(NOT_ALLOWED);
          done();
        });
    });

    it("it should update workbook", done => {
      chai.request(params._apiUrl)
        .patch(`/workbooks/${workbookId}`)
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${adminValidToken}`)
        .send({ email: "test4@mail.com" })
        .end((err, res) => {
          res.should.have.status(SUCCESS_CODE);
          res.body.status.should.be.equal(SUCCESS_STATUS_MESSAGE);
          expect(res.body.errors).to.be.null;
          res.body.data.should.not.be.null;
          res.body.data.workbook.should.not.be.null;
          done();
        });
    });

    after((done) => {
      WorkbookService.delete(workbookId)
        .then(() => {
          done();
        })
        .catch((e) => {
          console.dir(e);
          done();
        });
    });
  });

  describe("/workbooks/:id DELETE(delete workbook)", () => {
    const adminUserID = 1,
      viewerUserID = 2;

    let workbookId;

    let adminToken,
      viewerToken,
      invalidToken;

    before((done) => {
      invalidToken = "asdfasdfasdf";
      adminToken = jwt.sign({ id: adminUserID }, params.tokenSecret, { expiresIn: 900 });
      viewerToken = jwt.sign({ id: viewerUserID }, params.tokenSecret, { expiresIn: 900 });

      WorkbookService.create({
        firstName: "FirstNameTest",
        lastName: "LastNameTest",
        email: "test3@test.com",
        passport: "AM45687231",
        birthDate: "3/6/1990"
      })
        .then(workbook => {
          workbookId = workbook.id;
          done();
        })
        .catch((e) => {
          console.dir(e);
          done();
        });
    });

    it("it should give auth error for missing token", done => {
      chai.request(params._apiUrl)
        .del(`/workbooks/${workbookId}`)
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .end((err, res) => {
          res.should.have.status(UNAUTHORIZED_CODE);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          expect(res.body.errors).to.be.null;
          expect(res.body.data).to.be.null;
          done();
        });
    });

    it("it should give auth error for invalid token", done => {
      chai.request(params._apiUrl)
        .del(`/workbooks/${workbookId}`)
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${invalidToken}`)
        .end((err, res) => {
          res.should.have.status(UNAUTHORIZED_CODE);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          expect(res.body.errors).to.be.null;
          expect(res.body.data).to.be.null;
          done();
        });
    });

    it("it should give permission error to viewer", done => {
      chai.request(params._apiUrl)
        .del(`/workbooks/${workbookId}`)
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${viewerToken}`)
        .end((err, res) => {
          res.should.have.status(FORBIDDEN_CODE);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          expect(res.body.data).to.be.null;
          res.body.errors.should.not.be.null;
          res.body.errors.message.should.be.equal(NOT_ALLOWED);
          done();
        });
    });

    it("it should give not found error", done => {
      chai.request(params._apiUrl)
        .del(`/workbooks/1999999`)
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${adminToken}`)
        .end((err, res) => {
          res.should.have.status(NOT_FOUND_CODE);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          expect(res.body.errors).to.be.null;
          expect(res.body.data).to.be.null;
          done();
        });
    });

    it("it should delete workbook", done => {
      chai.request(params._apiUrl)
        .del(`/workbooks/${workbookId}`)
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${adminToken}`)
        .end((err, res) => {
          res.should.have.status(NO_CONTENT_CODE);
          expect(res.body.errors).to.be.undefined;
          expect(res.body.data).to.be.undefined;
          done();
        });
    });
  });

  describe("/workbooks GET(get workbooks)", () => {
    const adminUserID = 1,
      viewerUserID = 2;

    let adminValidToken,
      adminExpiredToken,
      viewerToken,
      invalidToken;

    before((done) => {
      invalidToken = "asdfasdfasdf";
      adminValidToken = jwt.sign({ id: adminUserID }, params.tokenSecret, { expiresIn: 900 });
      adminExpiredToken = jwt.sign({ id: adminUserID }, params.tokenSecret, { expiresIn: 0 });
      viewerToken = jwt.sign({ id: viewerUserID }, params.tokenSecret, { expiresIn: 900 });
      done();
    });

    it("it should get workbooks", done => {
      chai.request(params._apiUrl)
        .get("/workbooks/")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${adminValidToken}`)
        .end((err, res) => {
          res.should.have.status(SUCCESS_CODE);
          res.body.status.should.be.equal(SUCCESS_STATUS_MESSAGE);
          expect(res.body.errors).to.be.null;
          res.body.data.workbooks.should.not.be.null;
          res.body.data.workbooks.length.should.be.equal(2);
          done();
        });
    });

    it("it should get workbooks by firstName", done => {
      chai.request(params._apiUrl)
        .get("/workbooks?firstName=FirstNameOne")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${adminValidToken}`)
        .end((err, res) => {
          res.should.have.status(SUCCESS_CODE);
          res.body.status.should.be.equal(SUCCESS_STATUS_MESSAGE);
          expect(res.body.errors).to.be.null;
          res.body.data.workbooks.should.not.be.null;
          res.body.data.workbooks.length.should.be.equal(1);
          done();
        });
    });

    it("it should get workbooks by viewer", done => {
      chai.request(params._apiUrl)
        .get("/workbooks/")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${viewerToken}`)
        .end((err, res) => {
          res.should.have.status(SUCCESS_CODE);
          res.body.status.should.be.equal(SUCCESS_STATUS_MESSAGE);
          expect(res.body.errors).to.be.null;
          res.body.data.workbooks.should.not.be.null;
          res.body.data.workbooks.length.should.be.equal(2);
          done();
        });
    });

    it("it should get one workbook", done => {
      chai.request(params._apiUrl)
        .get("/workbooks?limit=1")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${adminValidToken}`)
        .end((err, res) => {
          res.should.have.status(SUCCESS_CODE);
          res.body.status.should.be.equal(SUCCESS_STATUS_MESSAGE);
          expect(res.body.errors).to.be.null;
          res.body.data.workbooks.should.not.be.null;
          res.body.data.workbooks.length.should.be.equal(1);
          done();
        });
    });
  });

});
