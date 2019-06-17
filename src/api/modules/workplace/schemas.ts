"use strict";

import { MIN_LENGTH } from "../../../configs/constants";

export default {
  updateWorkplace: {
    validation: {
      id: {
        in: "params",
        optional: true,
      },
      workbookId: {
        in: "body",
        optional: true,
        isAlphanumeric: true,
      },
      startDate: {
        in: "body",
        optional: true,
      },
      endDate: {
        in: "body",
        optional: true,
      },
      company: {
        in: "body",
        optional: true,
      },
      country: {
        in: "body",
        optional: true,
      },
      city: {
        in: "body",
        optional: true,
      },
    },
    authentication: true,
    permissions: {
      isAdmin: true,
    },
  },
  deleteWorkplace: {
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
  createWorkplace: {
    validation: {
      workbookId: {
        in: "body",
        notEmpty: true,
        isAlphanumeric: true,
      },
      startDate: {
        in: "body",
        notEmpty: true,
      },
      endDate: {
        in: "body",
        optional: true,
      },
      company: {
        in: "body",
        notEmpty: true,
      },
      country: {
        in: "body",
        notEmpty: true,
      },
      city: {
        in: "body",
        notEmpty: true,
      },
    },
    authentication: true,
    permissions: {
      isAdmin: true,
    },
  },
  getWorkplaces: {
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
      workbookId: {
        in: "query",
        optional: true,
        isAlphanumeric: true,
      },
      ids: {
        in: "query",
        optional: true,
        isIntArray: true,
      },
      startDate: {
        in: "body",
        optional: true,
      },
      endDate: {
        in: "body",
        optional: true,
      },
      company: {
        in: "body",
        optional: true,
      },
      country: {
        in: "body",
        optional: true,
      },
      city: {
        in: "body",
        optional: true,
      },
    },
    authentication: true,
    sanitizer: [
      {
        params: ["ids"],
        sanitizerFunction: "toIntArray",
        place: "Query",
      },
    ],
  },
};
