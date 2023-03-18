import express from "express";
import {
  changeCategoryName,
  createCategory,
  deleteCategory,
} from "../controller/category/category.controller";
import { createCategoryValidate } from "../requestValidations/category/createCategory.joy";
import { changeCategoryNameValidate } from "../requestValidations/category/changeCategoryName.joy";
import { deleteCategoryValidate } from "../requestValidations/category/deleteCategory.joy";

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

CategoryRouter.delete("/delete/:id", deleteCategoryValidate, deleteCategory);
export default CategoryRouter;
