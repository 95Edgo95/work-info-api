"use strict";

const cors: any = {
  development: {
    origin: [/localhost:3000/, /localhost:3002/],
    credentials: true,
    allowedHeaders: [
      "Content-Type", "Accept", "Authorization", "X-XSRF-Token",
    ],
  },
  production: {
    origin: "https://work-info-app.herokuapp.com",
    credentials: true,
    allowedHeaders: [
      "Content-Type", "Accept", "Authorization", "X-XSRF-Token",
    ],
  },
};

export default cors[process.env.NODE_ENV || "development"];
