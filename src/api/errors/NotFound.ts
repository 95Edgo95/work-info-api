"use strict";

import { NOT_FOUND } from "../../configs/response-messages";
import { NOT_FOUND_CODE } from "../../configs/status-codes";

export default class NotFound extends Error {

  constructor(resource: string, errors?: any) {
    super();
    this.message = NOT_FOUND(resource);
    this.errors = errors;
  }

  public status: number = NOT_FOUND_CODE;
  public message: string;
  public errors: any;
}
