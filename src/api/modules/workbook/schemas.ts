"use strict";

import { MIN_LENGTH } from "../../../configs/constants";

export default {
  updateWorkbook: {
    validation: {
      id: {
        in: "params",
        notEmpty: true,
      },
      firstName: {
        in: "body",
        optional: true,
        isAlpha: true,
      },
      lastName: {
        in: "body",
        optional: true,
        isAlpha: true,
      },
      email: {
        in: "body",
        optional: true,
        isEmail: true,
      },
      passport: {
        in: "body",
        optional: true,
        isAlphanumeric: true,
      },
      birthDate: {
        in: "body",
        optional: true,
        isGreater18: true,
      },
      currentWorkplaceId: {
        in: "body",
        optional: true,
      },
    },
    authentication: true,
    permissions: {
      isAdmin: true,
    },
  },
  deleteWorkbook: {
    validation: {
      id: {
        in: "params",
        notEmpty: true,
      },
    },
    authentication: true,
    permissions: {
      isAdmin: true,
    },
  },
  getWorkbook: {
    validation: {
      id: {
        in: "params",
        notEmpty: true,
      },
    },
    authentication: true,
  },
  createWorkbook: {
    validation: {
      firstName: {
        in: "body",
        notEmpty: true,
        isAlpha: true,
      },
      lastName: {
        in: "body",
        notEmpty: true,
        isAlpha: true,
      },
      email: {
        in: "body",
        notEmpty: true,
        isEmail: true,
      },
      passport: {
        in: "body",
        notEmpty: true,
        isAlphanumeric: true,
      },
      birthDate: {
        in: "body",
        notEmpty: true,
        isGreater18: true,
      },
    },
    authentication: true,
    permissions: {
      isAdmin: true,
    },
  },
  getWorkbooks: {
    validation: {
      offset: {
        optional: true,
        in: "query",
        isInt: {
          options: [{ min: MIN_LENGTH }],
        },
      },
      limit: {
        optional: true,
        in: "query",
        isInt: {
          options: [{ min: MIN_LENGTH }],
        },
      },
      firstName: {
        in: "query",
        optional: true,
        isAlpha: true,
      },
      lastName: {
        in: "query",
        optional: true,
        isAlpha: true,
      },
      email: {
        in: "query",
        optional: true,
        isEmail: true,
      },
      passport: {
        in: "query",
        optional: true,
      },
    },
    authentication: true,
    sanitizer: [
      {
        params: ["limit", "offset"],
        sanitizerFunction: "toInt",
        place: "Query",
      },
    ],
  },
};
