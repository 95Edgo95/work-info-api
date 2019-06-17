"use strict";

import ServiceUnavailable from "../errors/ServiceUnavailable";
import { NextFunction, Request, Response } from "express";
import ValidationError from "../errors/ValidationError";

interface IObj {
  validationFunction: string;
  functionOptions?: any;
  message: string;
  place: string;
  param: string;
}

export default (schema?: any, additional?: Array<IObj>) => {
  return async (req: Request, res: Response, next: NextFunction) => {

    if (schema) {
      req.check(schema);
    }

    if (additional && Array.isArray(additional)) {
      additional.forEach((obj: IObj) => {
        if (obj.validationFunction === "notEmpty") {
          req[`check${obj.place}`](obj.param, obj.message).notEmpty();
        } else if (obj.validationFunction === "isIn" && obj.functionOptions) {
          req[`check${obj.place}`](obj.param, obj.message).isIn(obj.functionOptions);
        }
      });
    }

    let result: any;

    try {
      result = await req.getValidationResult();
    } catch (error) {
      return next(new ServiceUnavailable({ message: error.message }));
    }

    if (result && !result.isEmpty()) {
      return next(new ValidationError(result.mapped()));
    }

    next();
  };
};
