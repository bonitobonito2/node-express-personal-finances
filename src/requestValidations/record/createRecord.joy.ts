import Joi from "joi";

import { Request, Response, NextFunction } from "express";

export const createRecord = Joi.object({
  userName: Joi.string().required(),
  password: Joi.string().required().min(4),
  description: Joi.string().required(),
  price: Joi.number().required(),
  process: Joi.string().valid("Processing", "Completed"),
  type: Joi.string().required().valid("income", "outcome"),
  categoryName: Joi.string(),
});

export function createRecordValidate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { error } = createRecord.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  next();
}
