"use strict";

import { SOMETHING_WENT_WRONG } from "../../configs/response-messages";
import { BAD_REQUEST_CODE } from "../../configs/status-codes";

export default class ServiceUnavailable extends Error {

  constructor(data: any, errors?: any) {
    super();

    if (errors) {
      this.message = data;
      this.errors = errors;
    } else {
      if (typeof data === "string") {
        this.message = data;
      } else {
        this.errors = data;
      }
    }
  }

  public status: number = BAD_REQUEST_CODE;
  public message: string = SOMETHING_WENT_WRONG;
  public errors: any;
}
