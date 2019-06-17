"use strict";

import { createWorkplace, deleteWorkplace, getWorkplaces, updateWorkplace, getWorkplace } from "./WorkplaceController";
import middlewares from "../../middlewares";
import { Router } from "express";
import schemas from "./schemas";

export default (router: Router) => {
  router.delete("/:id", ...middlewares(schemas, "deleteWorkplace"), deleteWorkplace);

  router.patch("/:id", ...middlewares(schemas, "updateWorkplace"), updateWorkplace);

  router.post("/", ...middlewares(schemas, "createWorkplace"), createWorkplace);

  router.get("/:id", ...middlewares(schemas, "getWorkplace"), getWorkplace);

  router.get("/", ...middlewares(schemas, "getWorkplaces"), getWorkplaces);
};
