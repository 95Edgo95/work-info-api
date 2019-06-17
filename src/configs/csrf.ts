"use strict";

const csrf: any = {
  development: {
    cookie: {
      httpOnly: true,
      secure: false,
      key: "_csrf",
    },
  },
  production: {
    cookie: {
      httpOnly: true,
      secure: true,
      key: "_csrf",
    },
  },
};

export default csrf[process.env.NODE_ENV || "development"];
