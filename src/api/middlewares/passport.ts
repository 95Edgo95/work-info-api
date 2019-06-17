"use strict";

import { UNAUTHORIZED } from "../../configs/response-messages";
import AuthError from "../errors/AuthError";
import * as passport from "passport";

export default (userRequired) => (req, res, next) => {
  return passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err && userRequired) {
      return next(err);
    }

    if (!user && userRequired) {
      return next(new AuthError(UNAUTHORIZED));
    }

    req.user = user;
    next();
  })(req, res, next);
};
