"use strict";

export const SUCCESSFULLY_RETRIEVED: (resource: string) => string = resource => `${resource} successfully retrieved.`;

export const CREATED: (resource: string) => string = resource => `${resource} successfully created.`;

export const UPDATED: (resource: string) => string = resource => `${resource} successfully updated.`;

export const CREDENTIALS_NOT_MATCHING: string = "Authentication failed. Credentials do not match.";

export const NOT_UNIQUE: (resource: string) => string = resource => `${resource} must be unique`;

export const NOT_FOUND: (resource: string) => string = resource => `${resource} not found.`;

export const ACCESS_TOKEN_REFRESHED: string = "Access Token successfully refreshed.";

export const INVALID_AUTHORIZATION_HEADER: string = "Invalid Authorization header.";

export const USER_NOT_EXIST: string = "User with these credentials didn't exist.";

export const SOMETHING_WENT_WRONG: string = "Something went wrong. Try again.";

export const SUCCESSFULLY_SIGNED_IN: string = "User successfully signed in.";

export const NOT_ALLOWED: string = "You not allowed to perform this action.";

export const INVALID_REFRESH_TOKEN: string = "Refresh token is not valid.";

export const VALIDATION_ERROR: string = "Request didn't pass validation.";

export const INVALID_BASE64: string = "Invalid base64 encrypted string.";

export const PERMISSION_DENIED: string = "Permission Denied.";

export const UNAUTHORIZED: string = "User is not signed in!";

export const SUCCESS_STATUS_MESSAGE: string = "Success";

export const FAIL_STATUS_MESSAGE: string = "Failed";
