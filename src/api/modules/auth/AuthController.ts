"use strict";

import { NO_CONTENT_CODE, SUCCESS_CODE } from "../../../configs/status-codes";
import * as messages from "../../../configs/response-messages";
import { NextFunction, Request, Response } from "express";
import { IPayload } from "../../strategies/passport-jwt";
import BadRequest from "../../errors/BadRequest";
import AuthError from "../../errors/AuthError";
import params from "../../../configs/params";
import AuthService from "./AuthService";
import * as jwt from "jsonwebtoken";
import * as base64 from "base-64";

export async function refreshToken(req: Request, res: Response, next: NextFunction): Promise<any> {

  const { refreshToken } = req.cookies;
  let decoded: IPayload | any;

  try {
    decoded = jwt.verify(refreshToken, params.refreshSecret);
  } catch (error) {
    res.cookie("refreshToken", "");
    return next(new BadRequest(messages.INVALID_REFRESH_TOKEN, { message: error.message }));
  }

  let user: any | undefined;

  if (!decoded.id) {
    res.cookie("refreshToken", "");
    return next(new BadRequest(messages.INVALID_REFRESH_TOKEN));
  }

  user = AuthService.findById(decoded.id);

  if (!user) {
    res.cookie("refreshToken", "");
    return next(new BadRequest(messages.USER_NOT_EXIST));
  }

  const accessToken: string = jwt.sign({
                                         id: decoded.id,
                                         created_at: Date.now(),
                                       }, params.tokenSecret, { expiresIn: 900 });

  return res.status(SUCCESS_CODE).json({
                                         status: messages.SUCCESS_STATUS_MESSAGE,
                                         message: messages.ACCESS_TOKEN_REFRESHED,
                                         data: {
                                           accessToken,
                                           user: {
                                             office_id: user.office_id,
                                             username: user.username,
                                             role: user.role,
                                             code: user.code,
                                           },
                                         },
                                         errors: null,
                                       });
}

export async function signIn(req: Request, res: Response, next: NextFunction): Promise<any> {

  const { username, password } = req.body;

  const authHeader: string | undefined = req.header("Authorization");

  if (!authHeader) {
    return;
  }

  if (!authHeader.includes(" ")) {
    return next(new AuthError(messages.INVALID_AUTHORIZATION_HEADER));
  }

  const baseToken: string = authHeader.split(" ")[1];

  let details: string = "";

  try {
    details = base64.decode(baseToken);
  } catch (error) {
    return next(new BadRequest(messages.INVALID_BASE64, { message: error.message }));
  }

  if (!details.includes(":")) {
    return next(new AuthError(messages.INVALID_AUTHORIZATION_HEADER));
  }

  const [headerUsername, headerPassword] = details.split(":");

  if (username !== headerUsername || password !== headerPassword) {
    return next(new AuthError(messages.CREDENTIALS_NOT_MATCHING));
  }

  let user: any | undefined;

  user = AuthService.find(username, password);

  if (!user) {
    return next(new BadRequest(messages.USER_NOT_EXIST));
  }

  const payload: IPayload = { id: user.id, created_at: Date.now() };
  const token: string = jwt.sign(payload, params.tokenSecret, { expiresIn: 900 });
  const refreshToken: string = jwt.sign({ ...payload }, params.refreshSecret);

  res.cookie("refreshToken", refreshToken, { path: "/", httpOnly: true });

  const userData: any = {
    ...user,
    token,
  };

  delete userData.password;

  return res.status(SUCCESS_CODE).json({
                                         status: messages.SUCCESS_STATUS_MESSAGE,
                                         message: messages.SUCCESSFULLY_SIGNED_IN,
                                         data: {
                                           user: userData,
                                         },
                                         errors: null,
                                       });
}

export async function getUser(req: Request, res: Response, next: NextFunction): Promise<any> {
  const user: any = { ...req.user };

  delete user.password;

  return res.status(SUCCESS_CODE).json({
                                         status: messages.SUCCESS_STATUS_MESSAGE,
                                         message: messages.SUCCESSFULLY_SIGNED_IN,
                                         data: { user },
                                         errors: null,
                                       });
}

export async function signOut(req: Request, res: Response): Promise<any> {
  res.cookie("refreshToken", "");

  req.logout();

  return res.status(NO_CONTENT_CODE).json({});
}

export function getCsrf(req: Request, res: Response): Response {
  const csrf: string = req.csrfToken();
  return res.status(SUCCESS_CODE).json({ csrf: csrf });
}
