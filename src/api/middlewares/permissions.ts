"use strict";

import { NOT_ALLOWED } from "../../configs/response-messages";
import { NextFunction, Request, Response } from "express";
import { ADMIN_ROLE } from "../../configs/constants";
import ForbiddenError from "../errors/Forbidden";

export interface IPermissionsOptions {
  isAdmin: boolean;
}

export default (permissions: IPermissionsOptions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (permissions.isAdmin) {
      if (req.user.role !== ADMIN_ROLE) {
        return next(new ForbiddenError({ message: NOT_ALLOWED }));
      }
    }

    next();
  };
};
