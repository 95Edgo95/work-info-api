"use strict";

import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import { USER_NOT_EXIST } from "../../configs/response-messages";
import AuthService from "../modules/auth/AuthService";
import AuthError from "../errors/AuthError";
import { PassportStatic } from "passport";
import IUser from "../modules/auth/User";

export interface IPayload {
  id: number;
  created_at: number;
}

export default (secret: string, passport: PassportStatic): void => {

  passport.serializeUser((user: IUser, done: (err: any, id: number) => void) => {
    done(null, user.id);
  });

  passport.deserializeUser((id: number, done: (err: any, user: IUser | null) => void) => {
    const user = AuthService.findById(id);

    user ? done(null, user) : done(new AuthError(USER_NOT_EXIST), null);
  });

  const jwtOptions: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("Bearer"),
    secretOrKey: secret,
  };

  const strategy: Strategy = new Strategy(jwtOptions, (payload: IPayload, next) => {
    const user = AuthService.findById(payload.id);

    if (user) {
      next(null, user);
    } else {
      next(new AuthError(USER_NOT_EXIST), false);
    }
  });

  passport.use(strategy);
};
