"use strict";

import { NextFunction, Response } from "express";

interface IObj {
  sanitizerFunction: string;
  functionOptions?: any;
  params: string[];
  place: string;
}

export default (options: IObj[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (Array.isArray(options)) {
      options.forEach((obj: IObj) => {
        switch (obj.place) {
          case "Body":
            obj.params.forEach((param) => {
              if (req.body[param]) {
                switch (obj.sanitizerFunction) {
                  case "escape":
                    req.sanitizeBody(param).escape();
                    break;
                  case "toIntArray":
                    if (typeof req.body[param] === "string") {
                      if (req.body[param].includes(",")) {
                        req.body[param] = req.body[param].split(",").map(num => +num);
                      } else {
                        req.body[param] = [+req.body[param]];
                      }
                    } else if (typeof req.body[param] === "number") {
                      req.body[param] = [req.body[param]];
                    }
                    break;
                  case "toInt":
                    if (!Number.isInteger(req.body[param])) {
                      req.sanitizeBody(param).toInt();
                    }
                    break;
                  case "trim":
                    req.sanitizeBody(param).trim(" ");
                    break;
                  case "toBoolean":
                    req.sanitizeBody(param).toBoolean(obj.functionOptions);
                    break;
                  case "replace":
                    if (obj.functionOptions && obj.functionOptions.search && obj.functionOptions.replace) {
                      req.body[param] = req.body[param].replace(obj.functionOptions.search, obj.functionOptions.replace);
                    }
                    break;
                  default:
                    break;
                }
              }
            });
            break;
          case "Params":
            obj.params.forEach((param) => {
              if (req.params[param]) {
                switch (obj.sanitizerFunction) {
                  case "escape":
                    req.sanitizeParams(param).escape();
                    break;
                  case "toIntArray":
                    if (typeof req.params[param] === "string") {
                      if (req.params[param].includes(",")) {
                        req.params[param] = req.params[param].split(",").map(num => +num);
                      } else {
                        req.params[param] = [+req.params[param]];
                      }
                    } else if (typeof req.params[param] === "number") {
                      req.params[param] = [req.params[param]];
                    }
                    break;
                  case "toInt":
                    if (!Number.isInteger(req.params[param])) {
                      req.sanitizeParams(param).toInt();
                    }
                    break;
                  case "trim":
                    req.sanitizeParams(param).trim(" ");
                    break;
                  case "toBoolean":
                    req.sanitizeParams(param).toBoolean(obj.functionOptions);
                    break;
                  case "replace":
                    if (obj.functionOptions && obj.functionOptions.search && obj.functionOptions.replace) {
                      req.params[param] = req.params[param].replace(obj.functionOptions.search, obj.functionOptions.replace);
                    }
                    break;
                  default:
                    break;
                }
              }
            });
            break;
          case "Query":
            obj.params.forEach((param) => {
              if (req.query[param]) {
                switch (obj.sanitizerFunction) {
                  case "escape":
                    req.sanitizeQuery(param).escape();
                    break;
                  case "toIntArray":
                    if (typeof req.query[param] === "string") {
                      if (req.query[param].includes(",")) {
                        req.query[param] = req.query[param].split(",").map(num => +num);
                      } else {
                        req.query[param] = [+req.query[param]];
                      }
                    } else if (typeof req.query[param] === "number") {
                      req.query[param] = [req.query[param]];
                    }
                    break;
                  case "toInt":
                    if (!Number.isInteger(req.query[param])) {
                      req.sanitizeQuery(param).toInt();
                    }
                    break;
                  case "trim":
                    req.sanitizeQuery(param).trim(" ");
                    break;
                  case "toBoolean":
                    req.sanitizeQuery(param).toBoolean(obj.functionOptions);
                    break;
                  case "replace":
                    if (obj.functionOptions && obj.functionOptions.search && obj.functionOptions.replace) {
                      req.query[param] = req.query[param].replace(obj.functionOptions.search, obj.functionOptions.replace);
                    }
                    break;
                  default:
                    break;
                }
              }
            });
            break;
          case "Headers":
            obj.params.forEach((param) => {
              if (req.headers[param]) {
                switch (obj.sanitizerFunction) {
                  case "escape":
                    req.sanitizeHeaders(param).escape();
                    break;
                  case "toIntArray":
                    if (typeof req.headers[param] === "string") {
                      if (req.headers[param].includes(",")) {
                        req.headers[param] = req.headers[param].split(",").map(num => +num);
                      } else {
                        req.headers[param] = [+req.headers[param]];
                      }
                    } else if (typeof req.headers[param] === "number") {
                      req.headers[param] = [req.headers[param]];
                    }
                    break;
                  case "toInt":
                    if (!Number.isInteger(req.headers[param])) {
                      req.sanitizeHeaders(param).toInt();
                    }
                    break;
                  case "trim":
                    req.sanitizeHeaders(param).trim(" ");
                    break;
                  case "toBoolean":
                    req.sanitizeHeaders(param).toBoolean(obj.functionOptions);
                    break;
                  case "replace":
                    if (obj.functionOptions && obj.functionOptions.search && obj.functionOptions.replace) {
                      req.headers[param] = req.headers[param].replace(obj.functionOptions.search, obj.functionOptions.replace);
                    }
                    break;
                  default:
                    break;
                }
              }
            });
            break;
          case "Cookies":
            obj.params.forEach((param) => {
              if (req.cookies[param]) {
                switch (obj.sanitizerFunction) {
                  case "escape":
                    req.sanitizeCookies(param).escape();
                    break;
                  case "toIntArray":
                    if (typeof req.cookies[param] === "string") {
                      if (req.cookies[param].includes(",")) {
                        req.cookies[param] = req.cookies[param].split(",").map(num => +num);
                      } else {
                        req.cookies[param] = [+req.cookies[param]];
                      }
                    } else if (typeof req.cookies[param] === "number") {
                      req.cookies[param] = [req.cookies[param]];
                    }
                    break;
                  case "toInt":
                    if (!Number.isInteger(req.cookies[param])) {
                      req.sanitizeCookies(param).toInt();
                    }
                    break;
                  case "trim":
                    req.sanitizeCookies(param).trim(" ");
                    break;
                  case "toBoolean":
                    req.sanitizeCookies(param).toBoolean(obj.functionOptions);
                    break;
                  case "replace":
                    if (obj.functionOptions && obj.functionOptions.search && obj.functionOptions.replace) {
                      req.cookies[param] = req.cookies[param].replace(obj.functionOptions.search, obj.functionOptions.replace);
                    }
                    break;
                  default:
                    break;
                }
              }
            });
            break;
          default:
            break;
        }
      });
    }
    next();
  };
};
