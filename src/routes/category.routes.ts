import express from "express";
import { createCategory } from "../controller/category/category.controller";
import { createCategoryValidate } from "../requestValidations/category/createCategory.joy";

const CategoryRouter = express.Router();

CategoryRouter.use((req, res, next) => {
  next();
});

CategoryRouter.post("/create", createCategoryValidate, createCategory);

CategoryRouter.put("/changeName/:id");

export default CategoryRouter;
