import Joi from "joi";

import { Request, Response, NextFunction } from "express";

export const deleteCategory = Joi.object({});

export function deleteCategoryValidate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { error } = deleteCategory.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  next();
}
