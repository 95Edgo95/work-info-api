"use strict";

import { BAD_REQUEST_CODE } from "../../configs/status-codes";

export default class BadRequest extends Error {

  constructor(message: string, errors?: any) {
    super();
    this.message = message;
    this.errors = errors;
  }

  public status: number = BAD_REQUEST_CODE;
  public message: string;
  public errors: any;
}
