import express from "express";
import { createCategory } from "../controller/category/category.controller";
import { createCategoryValidate } from "../requestValidations/category/createCategory.joy";

const CategoryRouter = express.Router();

CategoryRouter.post("/create", createCategoryValidate, createCategory);

export default CategoryRouter;
