import express from "express";
import {
  changeCategoryName,
  createCategory,
} from "../controller/category/category.controller";
import { createCategoryValidate } from "../requestValidations/category/createCategory.joy";
import { changeCategoryNameValidate } from "../requestValidations/category/changeCategoryName.joy";

const CategoryRouter = express.Router();

CategoryRouter.use((req, res, next) => {
  next();
});

CategoryRouter.post("/create", createCategoryValidate, createCategory);

CategoryRouter.put(
  "/changeName/:id",
  changeCategoryNameValidate,
  changeCategoryName
);

export default CategoryRouter;
