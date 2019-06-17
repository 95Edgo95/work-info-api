"use strict";

import endpoints from "./endpoints";
import { Router } from "express";

export default (apiRouter: Router) => {
  const router: Router = Router();

  apiRouter.use("/workplaces", router);

  endpoints(router);
};
