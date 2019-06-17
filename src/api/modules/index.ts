"use strict";

import workplace from "./workplace";
import workbook from "./workbook";
import auth from "./auth";
import { Router } from "express";

export default (router: Router): void => {
  auth(router);
  workbook(router);
  workplace(router);
};
