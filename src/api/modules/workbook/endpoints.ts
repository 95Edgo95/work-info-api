"use strict";

import { createWorkbook, deleteWorkbook, getWorkbook, getWorkbooks, updateWorkbook } from "./WorkbookController";
import middlewares from "../../middlewares";
import schemas from "./schemas";
import { Router } from "express";

export default (router: Router) => {
  router.delete("/:id", ...middlewares(schemas, "deleteWorkbook"), deleteWorkbook);

  router.patch("/:id", ...middlewares(schemas, "updateWorkbook"), updateWorkbook);

  router.post("/", ...middlewares(schemas, "createWorkbook"), createWorkbook);

  router.get("/:id", ...middlewares(schemas, "getWorkbook"), getWorkbook);

  router.get("/", ...middlewares(schemas, "getWorkbooks"), getWorkbooks);
};
