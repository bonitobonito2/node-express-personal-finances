import Joi from "joi";

import { Request, Response, NextFunction } from "express";

export const changeCategoryName = Joi.object({
  newCategoryName: Joi.string().required(),
});

export function changeCategoryNameValidate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { error } = changeCategoryName.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  next();
}
