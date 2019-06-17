"use strict";

import { CREATED, SOMETHING_WENT_WRONG, SUCCESS_STATUS_MESSAGE, SUCCESSFULLY_RETRIEVED, UPDATED } from "../../../configs/response-messages";
import { CREATED_CODE, NO_CONTENT_CODE, SUCCESS_CODE } from "../../../configs/status-codes";
import ServiceUnavailable from "../../errors/ServiceUnavailable";
import { NextFunction, Request, Response } from "express";
import WorkbookService from "./WorkbookService";
import params from "../../../configs/params";
import IWorkbook from "./Workbook";

export async function createWorkbook(req: Request, res: Response, next: NextFunction): Promise<any> {
  let workbook: any | undefined;

  try {
    workbook = await WorkbookService.create(req.body);
  } catch (error) {
    return next(error);
  }

  if (!workbook) {
    return next(new ServiceUnavailable(SOMETHING_WENT_WRONG));
  }

  return res.status(CREATED_CODE).json({
    status: SUCCESS_STATUS_MESSAGE,
    message: CREATED("Workbook"),
    data: { workbook },
    errors: null,
  });
}

export async function updateWorkbook(req: Request, res: Response, next: NextFunction): Promise<any> {
  const { id } = req.params;
  let workbook: IWorkbook;

  try {
    workbook = await WorkbookService.update(req.body, id);
  } catch (error) {
    return next(error);
  }

  return res.status(SUCCESS_CODE).json({
    status: SUCCESS_STATUS_MESSAGE,
    message: UPDATED("Workbook"),
    data: { workbook },
    errors: null,
  });
}

export async function deleteWorkbook(req: Request, res: Response, next: NextFunction): Promise<any> {
  const { id } = req.params;

  try {
    await WorkbookService.delete(id);
  } catch (error) {
    return next(error);
  }

  return res.status(NO_CONTENT_CODE).json({});
}

export async function getWorkbooks(req: Request, res: Response, next: NextFunction): Promise<any> {
  const { firstName, lastName, email, passport, birthDate, offset = 0, limit = params.paginationLimit } = req.query;

  let workbooks: any[] | undefined;
  let count: number;

  try {
    const data = await WorkbookService.find({ firstName, lastName, email, passport, birthDate }, { offset, limit });
    workbooks = data.workbooks;
    count = data.count;
  } catch (error) {
    return next(error);
  }

  return res.status(SUCCESS_CODE).json({
    status: SUCCESS_STATUS_MESSAGE,
    message: SUCCESSFULLY_RETRIEVED("Workbooks"),
    data: { pagination: { offset, limit, count }, workbooks },
    errors: null,
  });
}

export async function getWorkbook(req: Request, res: Response, next: NextFunction): Promise<any> {
  const { id } = req.params;

  let workbook: any | undefined;

  try {
    workbook = await WorkbookService.findById(id);
  } catch (error) {
    return next(error);
  }

  return res.status(SUCCESS_CODE).json({
    status: SUCCESS_STATUS_MESSAGE,
    message: SUCCESSFULLY_RETRIEVED("Workbook"),
    data: { workbook },
    errors: null,
  });
}
