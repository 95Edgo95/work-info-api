"use strict";

import { UNAUTHORIZED_CODE } from "../../configs/status-codes";

export default class AuthError extends Error {

  constructor(message: string, errors?: any) {
    super();
    this.message = message;
    this.errors = errors;
  }

  public status: number = UNAUTHORIZED_CODE;
  public message: string;
  public errors: any = {};
}
