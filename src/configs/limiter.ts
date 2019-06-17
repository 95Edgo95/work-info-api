"use strict";

const limiter: any = {
  development: {
    windowMs: 900000,
    max: 2500,
    delayMs: 0,
  },
  production: {
    windowMs: 900000,
    max: 2500,
    delayMs: 0,
  },
};

export default limiter[process.env.NODE_ENV || "development"];
