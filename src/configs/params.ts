"use strict";

const params: any = {
  production: {
    _apiUrl: "http://localhost:3001/api/v1",
    appUrl: "https://work-info-app.herokuapp.com",
    apiUrl: "https://work-info-api.herokuapp.com/api/v1",
    _appUrl: "http://localhost:3000",
    hostname: "herokuapp.com",
    tokenSecret: "tasmanianDevil",
    refreshSecret: "refreshDevil",
    paginationLimit: 10,
    apiVersion: "v1",
    apiPort: process.env.PORT || 3001,
  },
  development: {
    _apiUrl: "http://localhost:3001/api/v1",
    apiUrl: "https://work-info-api.herokuapp.com/api/v1",
    appUrl: "https://work-info-app.herokuapp.com",
    hostname: "herokuapp.com",
    _appUrl: "http://127.0.0.1:3000",
    tokenSecret: "tasmanianDevil",
    refreshSecret: "refreshDevil",
    paginationLimit: 10,
    apiVersion: "v1",
    apiPort: process.env.PORT || 3001,
  },
};

export default params[process.env.NODE_ENV || "development"];
