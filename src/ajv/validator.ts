import Ajv from "ajv";
import { NextFunction, Response, Request } from "express";
import ApiError from "../utils/ApiError";
const ajv = new Ajv({ allErrors: true });
const schemaValidation = (schema: any) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validate = ajv.compile(schema);
      const valid = validate(req.body);
      if (!valid) {
        throw new ApiError(405, "Schema Error");
      }
      return next();
    } catch (e) {
      next(e);
    }
  };
};

export default schemaValidation;