"use strict";

import permissions from "./permissions";
import { RequestHandler } from "express";
import validator from "./validator";
import sanitizer from "./sanitizer";
import passport from "./passport";

export default (schemas: any, actionName: string): Array<RequestHandler> => {
  const middlewares: Array<any> = [];

  if (!schemas[actionName]) {
    return middlewares;
  }

  middlewares.push(passport(schemas[actionName].authentication));

  if (schemas[actionName].permissions) {
    middlewares.push(permissions(schemas[actionName].permissions));
  }

  if (schemas[actionName].validation) {
    middlewares.push(validator(schemas[actionName].validation, schemas[actionName].additional));
  } else if (schemas[actionName].additional) {
    middlewares.push(validator({}, schemas[actionName].additional));
  }

  if (schemas[actionName].sanitizer) {
    middlewares.push(sanitizer(schemas[actionName].sanitizer));
  }

  return middlewares;
};
