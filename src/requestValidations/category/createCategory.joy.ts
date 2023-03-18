import Joi from "joi";

import { Request, Response, NextFunction } from "express";

export const createCategory = Joi.object({
  categoryName: Joi.string().required(),
});

export function createCategoryValidate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { error } = createCategory.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  next();
}
