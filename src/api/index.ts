import { FAIL_STATUS_MESSAGE } from "../configs/response-messages";
import { BAD_REQUEST_CODE } from "../configs/status-codes";
import * as expressValidator from "express-validator";
import passportJwt from "./strategies/passport-jwt";
import * as RateLimit from "express-rate-limit";
import * as cookieParser from "cookie-parser";
import corsConfigs from "../configs/cors";
import csrfConfigs from "../configs/csrf";
import limiter from "../configs/limiter";
import params from "../configs/params";
import * as passport from "passport";
import * as express from "express";
import { json } from "body-parser";
import * as logger from "morgan";
import * as helmet from "helmet";
import modules from "./modules";
import * as csrf from "csurf";
import * as cors from "cors";

const rateLimiter: express.RequestHandler = new RateLimit(limiter);
const router: express.Router = express.Router();
const app: express.Application = express();

passportJwt(params.tokenSecret, passport);

app.use(cors(corsConfigs))
  .use(json())
  .use(expressValidator({
    customValidators: {
      isArray(value: any): boolean {
        return Array.isArray(value);
      },
      isGreater18(value: any): boolean {
        const date = new Date(value);
        return new Date(date.getFullYear() + 18, date.getMonth(), date.getDate()) <= new Date();
      },
      isIntArray(value: any): boolean {
        let result: boolean = Array.isArray(value);

        if (result) {
          for (let i: number = 0; i < value.length; i++) {
            if (!Number.isInteger(+value[i])) {
              result = false;
              break;
            }
          }
        } else if (Number.isInteger(+value)) {
          result = true;
        }

        return result;
      },
    },
  }))
  .use(cookieParser())
  .use(csrf(csrfConfigs))
  .use(rateLimiter)
  .use(helmet())
  .use(passport.initialize())
  .use(passport.session())
  .use(`/api/${params.apiVersion}`, router)
  .use((err, req, res, next) => {
    return res
      .status(err.status || BAD_REQUEST_CODE)
      .json({
        status: FAIL_STATUS_MESSAGE,
        data: null,
        message: err.message || "",
        errors: err.errors || null,
      });
  })
  .set("json spaces", 4);

if (app.get("env") !== "production") {
  app.use(logger("dev"));
}

modules(router);

export default app;
