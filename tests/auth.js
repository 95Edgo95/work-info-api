"use strict";

const { BAD_REQUEST_CODE, FORBIDDEN_CODE, NO_CONTENT_CODE, SUCCESS_CODE, UNAUTHORIZED_CODE, VALIDATION_ERROR_CODE } = require("../dist/configs/status-codes");
const {
  ACCESS_TOKEN_REFRESHED,
  CREDENTIALS_NOT_MATCHING,
  FAIL_STATUS_MESSAGE,
  INVALID_AUTHORIZATION_HEADER,
  INVALID_BASE64,
  INVALID_REFRESH_TOKEN,
  SUCCESS_STATUS_MESSAGE,
  SUCCESSFULLY_SIGNED_IN,
  USER_NOT_EXIST,
  VALIDATION_ERROR
} = require("../dist/configs/response-messages");
const { ADMIN_ROLE } = require("../dist/configs/constants");
const params = require("../dist/configs/params").default;
const chaiHttp = require("chai-http");
const jwt = require("jsonwebtoken");
const base64 = require("base-64");
const chai = require("chai");

const expect = chai.expect;
const should = chai.should();

chai.use(chaiHttp);

describe("Auth Module", () => {

  let csrf, cookies;

  before(done => {
    chai.request(params._apiUrl)
      .get("/auth/get-csrf")
      .set("origin", params._appUrl)
      .end((err, res) => {
        csrf = res.body.csrf;
        cookies = res.headers["set-cookie"];
        done();
      });
  });

  describe("/auth/sign-in POST(Sign user in)", () => {

    it("it should give csrf error for missing cookies", done => {
      chai.request(params._apiUrl)
        .post("/auth/sign-in")
        .set("origin", params._appUrl)
        .set("Authorization", `Basic ${base64.encode("admin:a@d#m$i(n)")}`)
        .set("X-XSRF-Token", csrf)
        .send({ username: "admin", password: "a@d#m$i(n)" })
        .end((err, res) => {
          res.should.have.status(FORBIDDEN_CODE);
          res.body.message.should.be.equal("invalid csrf token");
          expect(res.body.data).to.be.null;
          expect(res.body.errors).to.be.null;
          done();
        });
    });

    it("it should give csrf error for missing header", done => {
      chai.request(params._apiUrl)
        .post("/auth/sign-in")
        .set("origin", params._appUrl)
        .set("Authorization", `Basic ${base64.encode("admin:a@d#m$i(n)")}`)
        .set("Cookie", cookies)
        .send({ username: "admin", password: "a@d#m$i(n)" })
        .end((err, res) => {
          res.should.have.status(FORBIDDEN_CODE);
          res.body.message.should.be.equal("invalid csrf token");
          expect(res.body.data).to.be.null;
          expect(res.body.errors).to.be.null;
          done();
        });
    });

    it("it should give validation error for missing header", done => {
      chai.request(params._apiUrl)
        .post("/auth/sign-in")
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("origin", params._appUrl)
        .send({ username: "admin", password: "a@d#m$i(n)" })
        .end((err, res) => {
          res.should.have.status(VALIDATION_ERROR_CODE);
          res.body.message.should.be.equal(VALIDATION_ERROR);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          expect(res.body.data).to.be.null;
          res.body.errors.should.not.be.null;
          res.body.errors.authorization.should.not.be.null;
          done();
        });
    });

    it("it should give validation error from missing password", done => {
      chai.request(params._apiUrl)
        .post("/auth/sign-in")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Basic ${base64.encode("admin:a@d#m$i(n)")}`)
        .send({ username: "admin" })
        .end((err, res) => {
          res.should.have.status(VALIDATION_ERROR_CODE);
          res.body.message.should.be.equal(VALIDATION_ERROR);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          expect(res.body.data).to.be.null;
          res.body.errors.should.not.be.null;
          res.body.errors.password.should.not.be.null;
          done();
        });
    });

    it("it should give validation error for invalid password", done => {
      chai.request(params._apiUrl)
        .post("/auth/sign-in")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Basic ${base64.encode("admin:a@d#m$i(n)")}`)
        .send({ username: "admin", password: "123" })
        .end((err, res) => {
          res.should.have.status(VALIDATION_ERROR_CODE);
          res.body.message.should.be.equal(VALIDATION_ERROR);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          expect(res.body.data).to.be.null;
          res.body.errors.should.not.be.null;
          res.body.errors.password.should.not.be.null;
          done();
        });
    });

    it("it should give validation error for missing username", done => {
      chai.request(params._apiUrl)
        .post("/auth/sign-in")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Basic ${base64.encode("admin:a@d#m$i(n)")}`)
        .send({ password: "123456" })
        .end((err, res) => {
          res.should.have.status(VALIDATION_ERROR_CODE);
          res.body.message.should.be.equal(VALIDATION_ERROR);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          expect(res.body.data).to.be.null;
          res.body.errors.should.not.be.null;
          res.body.errors.username.should.not.be.null;
          done();
        });
    });

    it("it should give validation error for long username", done => {
      chai.request(params._apiUrl)
        .post("/auth/sign-in")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Basic ${base64.encode("asdfasdfasdfasdfasdfasdfasdfasdf@qwerqwerqwerqwerqwerqw.erqwerqwer:creator_pass")}`)
        .send({
          username: "asdfasdfasdfasdfasdfasdfasdfasdf@qwerqwerqwerqwerqwerqw.erqwerqwer",
          password: "123456"
        })
        .end((err, res) => {
          res.should.have.status(VALIDATION_ERROR_CODE);
          res.body.message.should.be.equal(VALIDATION_ERROR);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          expect(res.body.data).to.be.null;
          res.body.errors.should.not.be.null;
          res.body.errors.username.should.not.be.null;
          done();
        });
    });

    it("it should give authentication error for Auth header without space", done => {
      chai.request(params._apiUrl)
        .post("/auth/sign-in")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Basicasdfasdfasdfasdf`)
        .send({ username: "admin", password: "a@d#m$i(n)" })
        .end((err, res) => {
          res.should.have.status(UNAUTHORIZED_CODE);
          res.body.message.should.be.equal(INVALID_AUTHORIZATION_HEADER);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          expect(res.body.errors).to.be.null;
          expect(res.body.data).to.be.null;
          done();
        });
    });

    it("it should give Invalid base64 encrypted string", done => {
      chai.request(params._apiUrl)
        .post("/auth/sign-in")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Basic asdfasdasd:ffasdfasdf`)
        .send({ username: "admin", password: "a@d#m$i(n)" })
        .end((err, res) => {
          res.should.have.status(BAD_REQUEST_CODE);
          res.body.message.should.be.equal(INVALID_BASE64);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          expect(res.body.data).to.be.null;
          res.body.errors.message.should.be.equal("Invalid character: the string to be decoded is not correctly encoded.");
          done();
        });
    });

    it("it should give authentication error for Auth header without ':'", done => {
      chai.request(params._apiUrl)
        .post("/auth/sign-in")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Basic asdfasdfasdfasdf`)
        .send({ username: "admin", password: "a@d#m$i(n)" })
        .end((err, res) => {
          res.should.have.status(UNAUTHORIZED_CODE);
          res.body.message.should.be.equal(INVALID_AUTHORIZATION_HEADER);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          expect(res.body.errors).to.be.null;
          expect(res.body.data).to.be.null;
          done();
        });
    });

    it("it should give authentication error for not matching credentials", done => {
      chai.request(params._apiUrl)
        .post("/auth/sign-in")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Basic ${base64.encode("admn@user.com:a@d#m$i(n)")}`)
        .send({ username: "admin", password: "a@d#m$i(n)" })
        .end((err, res) => {
          res.should.have.status(UNAUTHORIZED_CODE);
          res.body.message.should.be.equal(CREDENTIALS_NOT_MATCHING);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          expect(res.body.data).to.be.null;
          expect(res.body.errors).to.be.null;
          done();
        });
    });

    it("it should say that user not exist", done => {
      chai.request(params._apiUrl)
        .post("/auth/sign-in")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Basic ${base64.encode("tests:a@d#m$i(n)")}`)
        .send({ username: "tests", password: "a@d#m$i(n)" })
        .end((err, res) => {
          res.should.have.status(BAD_REQUEST_CODE);
          res.body.message.should.be.equal(USER_NOT_EXIST);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          expect(res.body.data).to.be.null;
          expect(res.body.errors).to.be.null;
          done();
        });
    });

    it("it should sign in user", done => {
      chai.request(params._apiUrl)
        .post("/auth/sign-in")
        .set("origin", params._appUrl)
        .set("Authorization", `Basic ${base64.encode("admin:a@d#m$i(n)")}`)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .send({ username: "admin", password: "a@d#m$i(n)" })
        .end((err, res) => {
          res.should.have.status(SUCCESS_CODE);
          res.body.message.should.be.equal(SUCCESSFULLY_SIGNED_IN);
          res.body.status.should.be.equal(SUCCESS_STATUS_MESSAGE);
          expect(res.body.errors).to.be.null;
          res.body.data.should.not.be.null;
          res.body.data.user.token.should.not.be.null;
          done();
        });
    });
  });

  describe("/auth/sign-out POST(Sign user out)", () => {
    let token, expiredToken;

    before(done => {
      token = jwt.sign({ id: 1 }, params.tokenSecret, { expiresIn: 900 });
      expiredToken = jwt.sign({ id: 1 }, params.tokenSecret, { expiresIn: 0 });
      done();
    });

    it("it should give csrf error for missing cookies", done => {
      chai.request(params._apiUrl)
        .post("/auth/sign-out")
        .set("origin", params._appUrl)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(FORBIDDEN_CODE);
          res.body.message.should.be.equal("invalid csrf token");
          expect(res.body.data).to.be.null;
          expect(res.body.errors).to.be.null;
          done();
        });
    });

    it("it should give csrf error for missing header", done => {
      chai.request(params._apiUrl)
        .post("/auth/sign-out")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(FORBIDDEN_CODE);
          res.body.message.should.be.equal("invalid csrf token");
          expect(res.body.data).to.be.null;
          expect(res.body.errors).to.be.null;
          done();
        });
    });

    it("it should give unauthorized", done => {
      chai.request(params._apiUrl)
        .post("/auth/sign-out")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .end((err, res) => {
          res.should.have.status(UNAUTHORIZED_CODE);
          done();
        });
    });

    it("it should give 401 with expired token", done => {
      chai.request(params._apiUrl)
        .post("/auth/sign-out")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${expiredToken}`)
        .end((err, res) => {
          res.should.have.status(UNAUTHORIZED_CODE);
          done();
        });
    });

    it("it should sign user out", done => {
      chai.request(params._apiUrl)
        .post("/auth/sign-out")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(NO_CONTENT_CODE);
          done();
        });
    });
  });

  describe("/auth/refresh-token PUT(Update access token with refresh token)", () => {
    let refreshToken, refreshTokenWithoutID;

    before(done => {
      refreshToken = jwt.sign({ id: 1, role: ADMIN_ROLE }, params.refreshSecret);
      refreshTokenWithoutID = jwt.sign({ name: 1 }, params.refreshSecret);
      done();
    });

    it("it should give csrf error for missing cookies", done => {
      chai.request(params._apiUrl)
        .put("/auth/refresh-token")
        .set("origin", params._appUrl)
        .set("Cookie", `refreshToken=${refreshToken};`)
        .set("X-XSRF-Token", csrf)
        .end((err, res) => {
          res.should.have.status(FORBIDDEN_CODE);
          res.body.message.should.be.equal("invalid csrf token");
          expect(res.body.data).to.be.null;
          expect(res.body.errors).to.be.null;
          done();
        });
    });

    it("it should give csrf error for missing header", done => {
      chai.request(params._apiUrl)
        .put("/auth/refresh-token")
        .set("origin", params._appUrl)
        .set("Cookie", `${cookies};refreshToken=${refreshToken};`)
        .end((err, res) => {
          res.should.have.status(FORBIDDEN_CODE);
          res.body.message.should.be.equal("invalid csrf token");
          expect(res.body.data).to.be.null;
          expect(res.body.errors).to.be.null;
          done();
        });
    });

    it("it should give validation error for missing refresh token in cookies", done => {
      chai.request(params._apiUrl)
        .put("/auth/refresh-token")
        .set("origin", params._appUrl)
        .set("Cookie", cookies)
        .set("X-XSRF-Token", csrf)
        .end((err, res) => {
          res.should.have.status(VALIDATION_ERROR_CODE);
          res.body.message.should.be.equal(VALIDATION_ERROR);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          expect(res.body.data).to.be.null;
          res.body.errors.should.not.be.null;
          res.body.errors.refreshToken.should.not.be.null;
          Object.keys(res.body.errors).length.should.be.equal(1);
          done();
        });
    });

    it("it should give invalid token error with error message", done => {
      chai.request(params._apiUrl)
        .put("/auth/refresh-token")
        .set("origin", params._appUrl)
        .set("Cookie", `${cookies};refreshToken=asdfasdfasdf;`)
        .set("X-XSRF-Token", csrf)
        .end((err, res) => {
          res.should.have.status(BAD_REQUEST_CODE);
          res.body.message.should.be.equal(INVALID_REFRESH_TOKEN);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          expect(res.body.data).to.be.null;
          res.body.errors.message.should.be.equal("jwt malformed");
          done();
        });
    });

    it("it should give invalid token error without error message", done => {
      chai.request(params._apiUrl)
        .put("/auth/refresh-token")
        .set("origin", params._appUrl)
        .set("Cookie", `${cookies};refreshToken=${refreshTokenWithoutID};`)
        .set("X-XSRF-Token", csrf)
        .end((err, res) => {
          res.should.have.status(BAD_REQUEST_CODE);
          res.body.message.should.be.equal(INVALID_REFRESH_TOKEN);
          res.body.status.should.be.equal(FAIL_STATUS_MESSAGE);
          expect(res.body.data).to.be.null;
          expect(res.body.errors).to.be.null;
          done();
        });
    });

    it("it should refresh access token", done => {
      chai.request(params._apiUrl)
        .put("/auth/refresh-token")
        .set("origin", params._appUrl)
        .set("Cookie", `${cookies};refreshToken=${refreshToken};`)
        .set("X-XSRF-Token", csrf)
        .end((err, res) => {
          res.should.have.status(SUCCESS_CODE);
          res.body.message.should.be.equal(ACCESS_TOKEN_REFRESHED);
          res.body.status.should.be.equal(SUCCESS_STATUS_MESSAGE);
          expect(res.body.errors).to.be.null;
          res.body.data.accessToken.should.not.be.null;
          done();
        });
    });
  });

});
