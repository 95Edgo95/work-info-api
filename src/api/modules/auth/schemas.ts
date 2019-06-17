"use strict";

import { MIN_LENGTH, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, USERNAME_MAX_LENGTH } from "../../../configs/constants";

export default {
  refreshToken: {
    additional: [{
      place: "Cookies",
      param: "refreshToken",
      validationFunction: "notEmpty",
    }],
  },
  getUser: {
    authentication: true,
  },
  signOut: {
    authentication: true,
  },
  signIn: {
    validation: {
      username: {
        in: "body",
        notEmpty: true,
        isLength: {
          options: [{ min: MIN_LENGTH, max: USERNAME_MAX_LENGTH }],
        },
      },
      password: {
        in: "body",
        notEmpty: true,
      },
    },
    additional: [{
      place: "Headers",
      param: "Authorization",
      validationFunction: "notEmpty",
    }],
  },
};
