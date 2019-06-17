"use strict";

const { FAIL_STATUS_MESSAGE, NOT_ALLOWED, PERMISSION_DENIED, SUCCESS_STATUS_MESSAGE, UNAUTHORIZED, VALIDATION_ERROR } = require("../dist/configs/response-messages");
const { CREATED_CODE, FORBIDDEN_CODE, NO_CONTENT_CODE, UNAUTHORIZED_CODE, VALIDATION_ERROR_CODE, NOT_FOUND_CODE, SUCCESS_CODE } = require("../dist/configs/status-codes");
const WorkplaceService = require("../dist/api/modules/workplace/WorkplaceService").default;
const WorkbookService = require("../dist/api/modules/workbook/WorkbookService").default;
const params = require("../dist/configs/params").default;
const chaiHttp = require("chai-http");
const jwt = require("jsonwebtoken");
const chai = require("chai");

const expect = chai.expect;
const should = chai.should();

chai.use(chaiHttp);

describe("Workplace Module", () => {
  let csrf, cookies, workbookId;

  before((done) => {
    chai.request(params._apiUrl)
      .get("/auth/get-csrf")
      .set("origin", params._appUrl)
      .end((err, res) => {
        csrf = res.body.csrf;
        cookies = res.headers["set-cookie"];

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
  });

  describe("/workplaces POST(create workplace)", () => {
    const adminUserID = 1,
      viewerUserID = 2;

    let workplaceId = null;

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
        .post("/workplaces/")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("Authorization", `Bearer ${adminValidToken}`)
        .send({
          startDate: "5/11/2013",
          endDate: "14/9/2017",
          company: "Company test",
          country: "Armenia",
          city: "Yerevan",
          workbookId
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
        .post("/workplaces/")
        .set("origin", params._appUrl)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${adminValidToken}`)
        .send({
          startDate: "5/11/2013",
          endDate: "14/9/2017",
          company: "Company test",
          country: "Armenia",
          city: "Yerevan",
          workbookId
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
        .post("/workplaces/")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .send({
          startDate: "5/11/2013",
          endDate: "14/9/2017",
          company: "Company test",
          country: "Armenia",
          city: "Yerevan",
          workbookId
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
        .post("/workplaces/")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${adminExpiredToken}`)
        .send({
          startDate: "5/11/2013",
          endDate: "14/9/2017",
          company: "Company test",
          country: "Armenia",
          city: "Yerevan",
          workbookId
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
        .post("/workplaces/")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${invalidToken}`)
        .send({
          startDate: "5/11/2013",
          endDate: "14/9/2017",
          company: "Company test",
          country: "Armenia",
          city: "Yerevan",
          workbookId
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
        .post("/workplaces/")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${viewerToken}`)
        .send({
          startDate: "5/11/2013",
          endDate: "14/9/2017",
          company: "Company test",
          country: "Armenia",
          city: "Yerevan",
          workbookId
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

    it("it should give validation error for missing startDate", done => {
      chai.request(params._apiUrl)
        .post("/workplaces/")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${adminValidToken}`)
        .send({
          endDate: "14/9/2017",
          company: "Company test",
          country: "Armenia",
          city: "Yerevan",
          workbookId
        })
        .end((err, res) => {
          res.should.have.status(VALIDATION_ERROR_CODE);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          res.body.message.should.be.equal(VALIDATION_ERROR);
          expect(res.body.data).to.be.null;
          res.body.errors.should.not.be.null;
          res.body.errors.startDate.should.not.be.null;
          done();
        });
    });

    it("it should give validation error for missing company", done => {
      chai.request(params._apiUrl)
        .post("/workplaces/")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${adminValidToken}`)
        .send({
          startDate: "5/11/2013",
          endDate: "14/9/2017",
          country: "Armenia",
          city: "Yerevan",
          workbookId
        })
        .end((err, res) => {
          res.should.have.status(VALIDATION_ERROR_CODE);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          res.body.message.should.be.equal(VALIDATION_ERROR);
          expect(res.body.data).to.be.null;
          res.body.errors.should.not.be.null;
          res.body.errors.company.should.not.be.null;
          done();
        });
    });

    it("it should give validation error for missing country", done => {
      chai.request(params._apiUrl)
        .post("/workplaces/")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${adminValidToken}`)
        .send({
          startDate: "5/11/2013",
          endDate: "14/9/2017",
          company: "Company test",
          city: "Yerevan",
          workbookId
        })
        .end((err, res) => {
          res.should.have.status(VALIDATION_ERROR_CODE);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          res.body.message.should.be.equal(VALIDATION_ERROR);
          expect(res.body.data).to.be.null;
          res.body.errors.should.not.be.null;
          res.body.errors.country.should.not.be.null;
          done();
        });
    });

    it("it should give validation error for missing city", done => {
      chai.request(params._apiUrl)
        .post("/workplaces/")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${adminValidToken}`)
        .send({
          startDate: "5/11/2013",
          endDate: "14/9/2017",
          company: "Company test",
          country: "Armenia",
          workbookId
        })
        .end((err, res) => {
          res.should.have.status(VALIDATION_ERROR_CODE);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          res.body.message.should.be.equal(VALIDATION_ERROR);
          expect(res.body.data).to.be.null;
          res.body.errors.should.not.be.null;
          res.body.errors.city.should.not.be.null;
          done();
        });
    });

    it("it should give validation error for missing workbookId", done => {
      chai.request(params._apiUrl)
        .post("/workplaces/")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${adminValidToken}`)
        .send({
          startDate: "5/11/2013",
          endDate: "14/9/2017",
          company: "Company test",
          country: "Armenia",
          city: "Yerevan",
        })
        .end((err, res) => {
          res.should.have.status(VALIDATION_ERROR_CODE);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          res.body.message.should.be.equal(VALIDATION_ERROR);
          expect(res.body.data).to.be.null;
          res.body.errors.should.not.be.null;
          res.body.errors.workbookId.should.not.be.null;
          done();
        });
    });

    it("it should give validation error for missing passport", done => {
      chai.request(params._apiUrl)
        .post("/workplaces/")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${adminValidToken}`)
        .send({
          startDate: "5/11/2013",
          endDate: "14/9/2017",
          company: "Company test",
          country: "Armenia",
          city: "Yerevan",
          workbookId: "sadf 35 $#^#$^"
        })
        .end((err, res) => {
          res.should.have.status(VALIDATION_ERROR_CODE);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          res.body.message.should.be.equal(VALIDATION_ERROR);
          expect(res.body.data).to.be.null;
          res.body.errors.should.not.be.null;
          res.body.errors.workbookId.should.not.be.null;
          done();
        });
    });

    it("it should create workplace", done => {
      chai.request(params._apiUrl)
        .post("/workplaces/")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${adminValidToken}`)
        .send({
          startDate: "5/11/2013",
          endDate: "14/9/2017",
          company: "Company test",
          country: "Armenia",
          city: "Yerevan",
          workbookId
        })
        .end((err, res) => {
          res.should.have.status(CREATED_CODE);
          res.body.status.should.be.equal(SUCCESS_STATUS_MESSAGE);
          expect(res.body.errors).to.be.null;
          res.body.data.should.not.be.null;
          workplaceId = res.body.data.workplace.id;
          res.body.data.workplace.workbookId.should.be.equal(workbookId);
          res.body.data.workplace.should.not.be.null;
          done();
        });
    });

    after((done) => {
      WorkplaceService.delete(workplaceId)
        .then(() => {
          done();
        })
        .catch((e) => {
          console.dir(e);
          done();
        });
    });
  });

  describe("/workplaces/:id PATCH(update workplace)", () => {
    const adminUserID = 1,
      viewerUserID = 2;

    let workplaceId;

    let adminValidToken,
      adminExpiredToken,
      viewerToken,
      invalidToken;

    before((done) => {
      invalidToken = "asdfasdfasdf";
      adminValidToken = jwt.sign({ id: adminUserID }, params.tokenSecret, { expiresIn: 900 });
      adminExpiredToken = jwt.sign({ id: adminUserID }, params.tokenSecret, { expiresIn: 0 });
      viewerToken = jwt.sign({ id: viewerUserID }, params.tokenSecret, { expiresIn: 900 });

      WorkplaceService.create({
        startDate: "5/11/2013",
        endDate: "14/9/2017",
        company: "Company test",
        country: "Armenia",
        city: "Yerevan",
        workbookId
      })
        .then(workplace => {
          workplaceId = workplace.id;
          done();
        })
        .catch((e) => {
          console.dir(e);
          done();
        });
    });

    it("it should give invalid csrf error for missing cookies", done => {
      chai.request(params._apiUrl)
        .patch(`/workplaces/${workplaceId}`)
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("Authorization", `Bearer ${adminValidToken}`)
        .send({ city: "Test city" })
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
        .post(`/workplaces/${workplaceId}`)
        .set("origin", params._appUrl)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${adminValidToken}`)
        .send({ city: "Test city" })
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
        .patch(`/workplaces/${workplaceId}`)
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .send({ city: "Test city" })
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
        .patch(`/workplaces/${workplaceId}`)
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${adminExpiredToken}`)
        .send({ city: "Test city" })
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
        .patch(`/workplaces/${workplaceId}`)
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${invalidToken}`)
        .send({ city: "Test city" })
        .end((err, res) => {
          res.should.have.status(UNAUTHORIZED_CODE);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          res.body.message.should.be.equal(UNAUTHORIZED);
          expect(res.body.data).to.be.null;
          expect(res.body.errors).to.be.null;
          done();
        });
    });

    it("it should give not found", done => {
      chai.request(params._apiUrl)
        .patch("/workplaces/999999")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${adminValidToken}`)
        .send({ city: "Test city" })
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
        .patch(`/workplaces/${workplaceId}`)
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${viewerToken}`)
        .send({ city: "Test city" })
        .end((err, res) => {
          res.should.have.status(FORBIDDEN_CODE);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          expect(res.body.data).to.be.null;
          res.body.errors.should.not.be.null;
          res.body.errors.message.should.be.equal(NOT_ALLOWED);
          done();
        });
    });

    it("it should update workplace", done => {
      chai.request(params._apiUrl)
        .patch(`/workplaces/${workplaceId}`)
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${adminValidToken}`)
        .send({ city: "Test city" })
        .end((err, res) => {
          res.should.have.status(SUCCESS_CODE);
          res.body.status.should.be.equal(SUCCESS_STATUS_MESSAGE);
          expect(res.body.errors).to.be.null;
          res.body.data.should.not.be.null;
          res.body.data.workplace.should.not.be.null;
          done();
        });
    });

    after((done) => {
      WorkplaceService.delete(workplaceId)
        .then(() => {
          done();
        })
        .catch((e) => {
          console.dir(e);
          done();
        });
    });
  });

  describe("/workplaces/:id DELETE(delete workplace)", () => {
    const adminUserID = 1,
      viewerUserID = 2;

    let workplaceId;

    let adminToken,
      viewerToken,
      invalidToken;

    before((done) => {
      invalidToken = "asdfasdfasdf";
      adminToken = jwt.sign({ id: adminUserID }, params.tokenSecret, { expiresIn: 900 });
      viewerToken = jwt.sign({ id: viewerUserID }, params.tokenSecret, { expiresIn: 900 });

      WorkplaceService.create({
        startDate: "5/11/2013",
        endDate: "14/9/2017",
        company: "Company test",
        country: "Armenia",
        city: "Yerevan",
        workbookId
      })
        .then(workplace => {
          workplaceId = workplace.id;
          done();
        })
        .catch((e) => {
          console.dir(e);
          done();
        });
    });

    it("it should give auth error for missing token", done => {
      chai.request(params._apiUrl)
        .del(`/workplaces/${workplaceId}`)
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
        .del(`/workplaces/${workplaceId}`)
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
        .del(`/workplaces/${workplaceId}`)
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
        .del(`/workplaces/1999999`)
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

    it("it should delete workplace", done => {
      chai.request(params._apiUrl)
        .del(`/workplaces/${workplaceId}`)
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

  describe("/workplaces GET(get workplaces)", () => {
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

    it("it should get workplaces", done => {
      chai.request(params._apiUrl)
        .get("/workplaces/")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${adminValidToken}`)
        .end((err, res) => {
          res.should.have.status(SUCCESS_CODE);
          res.body.status.should.be.equal(SUCCESS_STATUS_MESSAGE);
          expect(res.body.errors).to.be.null;
          res.body.data.workplaces.should.not.be.null;
          res.body.data.workplaces.length.should.be.equal(5);
          done();
        });
    });

    it("it should get workplaces by workbookId", done => {
      chai.request(params._apiUrl)
        .get("/workplaces?workbookId=14mjbl")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${adminValidToken}`)
        .end((err, res) => {
          res.should.have.status(SUCCESS_CODE);
          res.body.status.should.be.equal(SUCCESS_STATUS_MESSAGE);
          expect(res.body.errors).to.be.null;
          res.body.data.workplaces.should.not.be.null;
          res.body.data.workplaces.length.should.be.equal(3);
          done();
        });
    });

    it("it should get workplaces by viewer", done => {
      chai.request(params._apiUrl)
        .get("/workplaces/")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${viewerToken}`)
        .end((err, res) => {
          res.should.have.status(SUCCESS_CODE);
          res.body.status.should.be.equal(SUCCESS_STATUS_MESSAGE);
          expect(res.body.errors).to.be.null;
          res.body.data.workplaces.should.not.be.null;
          res.body.data.workplaces.length.should.be.equal(5);
          done();
        });
    });

    it("it should get one workplace", done => {
      chai.request(params._apiUrl)
        .get("/workplaces?limit=1")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${adminValidToken}`)
        .end((err, res) => {
          res.should.have.status(SUCCESS_CODE);
          res.body.status.should.be.equal(SUCCESS_STATUS_MESSAGE);
          expect(res.body.errors).to.be.null;
          res.body.data.workplaces.should.not.be.null;
          res.body.data.workplaces.length.should.be.equal(1);
          done();
        });
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
