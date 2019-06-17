"use strict";

import { PERMISSION_DENIED } from "../../configs/response-messages";
import { FORBIDDEN_CODE } from "../../configs/status-codes";

export default class Forbidden extends Error {

  constructor(errors?: any) {
    super();
    this.errors = errors;
  }

  public status: number = FORBIDDEN_CODE;
  public message: string = PERMISSION_DENIED;
  public errors: any;
}
