"use strict";

import { CREATED, SOMETHING_WENT_WRONG, SUCCESS_STATUS_MESSAGE, SUCCESSFULLY_RETRIEVED, UPDATED } from "../../../configs/response-messages";
import { CREATED_CODE, NO_CONTENT_CODE, SUCCESS_CODE } from "../../../configs/status-codes";
import ServiceUnavailable from "../../errors/ServiceUnavailable";
import { NextFunction, Request, Response } from "express";
import WorkplaceService from "./WorkplaceService";
import params from "../../../configs/params";
import IWorkplace from "./Workplace";

export async function createWorkplace(req: Request, res: Response, next: NextFunction): Promise<any> {
  let workplace: any | undefined;

  try {
    workplace = await WorkplaceService.create(req.body);
  } catch (e) {
    return next(e);
  }

  if (!workplace) {
    return next(new ServiceUnavailable(SOMETHING_WENT_WRONG));
  }

  return res.status(CREATED_CODE).json({
    status: SUCCESS_STATUS_MESSAGE,
    message: CREATED("Workplace"),
    data: { workplace },
    errors: null,
  });
}

export async function updateWorkplace(req: Request, res: Response, next: NextFunction): Promise<any> {
  const { id } = req.params;
  let workplace: IWorkplace;

  try {
    workplace = await WorkplaceService.update(req.body, id);
  } catch (e) {
    return next(e);
  }

  return res.status(SUCCESS_CODE).json({
    status: SUCCESS_STATUS_MESSAGE,
    message: UPDATED("Workplace"),
    data: { workplace },
    errors: null,
  });
}

export async function deleteWorkplace(req: Request, res: Response, next: NextFunction): Promise<any> {
  const { id } = req.params;

  try {
    await WorkplaceService.delete(id);
  } catch (e) {
    return next(e);
  }

  return res.status(NO_CONTENT_CODE).json({});
}

export async function getWorkplaces(req: Request, res: Response, next: NextFunction): Promise<any> {
  const { startDate, endDate, company, country, city, ids, workbookId, offset = 0, limit = params.paginationLimit } = req.query;

  let workplaces: any[] | undefined;
  let count: number;

  try {
    const data = await WorkplaceService.find({ startDate, endDate, company, country, city, ids, workbookId }, { offset, limit });
    workplaces = data.workplaces;
    count = data.count;
  } catch (e) {
    return next(e);
  }

  return res.status(SUCCESS_CODE).json({
    status: SUCCESS_STATUS_MESSAGE,
    message: SUCCESSFULLY_RETRIEVED("Workplaces"),
    data: { pagination: { offset, limit }, workplaces },
    errors: null,
  });
}

export async function getWorkplace(req: Request, res: Response, next: NextFunction): Promise<any> {
  const { id } = req.params;

  let workplace: any | undefined;

  try {
    workplace = await WorkplaceService.findById(id);
  } catch (e) {
    return next(e);
  }

  return res.status(SUCCESS_CODE).json({
    status: SUCCESS_STATUS_MESSAGE,
    message: SUCCESSFULLY_RETRIEVED("Workplace"),
    data: { workplace },
    errors: null,
  });
}
