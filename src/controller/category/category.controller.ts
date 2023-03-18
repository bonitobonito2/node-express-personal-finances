import { RequestHandler, Router } from "express";
import { AuthService } from "../../service/auth.service";
import { CategoryService } from "../../service/category.service";
import { RecordService } from "../../service/record.service";

export const createCategory: RequestHandler = async (
  request,
  response,
  next
) => {
  const authService = new AuthService();
  const categoryService = new CategoryService();

  const userName = request.body["userName"];
  const password = request.body["password"];
  const categoryName = request.body["categoryName"];

  try {
    const userExsists = await authService.getUser(userName);

    if (userExsists && userExsists.password == password) {
      const createCategory = await categoryService.createCategoryAndCheck(
        categoryName,
        userExsists
      );
      if (createCategory == "category already exsists")
        return response.status(402).json("category already exsists");

      return response
        .status(200)
        .json({ data: `category ${categoryName} created` });
    } else {
      return response.status(403).json("username or password is uncorrect");
    }
  } catch (err) {
    next(err);
  }
};

export const changeCategoryName: RequestHandler = async (
  request,
  response,
  next
) => {
  const userName = request.body["userName"];
  const password = request.body["password"];
  const newCategoryName = request.body["newCategoryName"];

  const categoryId = parseInt(request.params.id);
  const categoryService = new CategoryService();
  const authService = new AuthService();

  try {
    const userExsists = await authService.getUser(userName);
    if (userExsists.password == password) {
      const categoryExsists = await categoryService.userHasCategory(
        categoryId,
        userExsists
      );
      if (categoryExsists) {
        await categoryService.changeCategoryNameById(
          categoryId,
          newCategoryName
        );

        return response.json(
          `category name changed with id ${categoryId} changed to ${newCategoryName}`
        );
      } else {
        return response
          .status(403)
          .json(`you dont have category with the id (${categoryId})`);
      }
    }
    return response.status(401).json("your userName or password is incorrect");
  } catch (err) {
    next(err);
  }
};

export const deleteCategory: RequestHandler = async (
  request,
  response,
  next
) => {
  const categoryId = parseInt(request.params["id"]);
  const userName = request.body["userName"];
  const password = request.body["password"];

  const authService = new AuthService();
  const categoryService = new CategoryService();
  const recordService = new RecordService();
  try {
    const userExsists = await authService.getUser(userName);
    if (userExsists && userExsists.password == password) {
      const userHasCategory = await categoryService.userHasCategory(
        categoryId,
        userExsists
      );

      if (typeof userHasCategory !== "boolean") {
        //getting records of this category
        const records = await recordService.getRecordsByCategory(
          userHasCategory
        );

        //deleting categories and it's records
        await categoryService.deleteCategory(userHasCategory, records);

        //checking if user has a default category
        const userHasDefaultCategory =
          await categoryService.userHasCategoryByName("default", userExsists);
        if (typeof userHasDefaultCategory !== "boolean") {
          //if user has a default category, moving old records in default
          await recordService.moveRecordsToDefaultCategory(
            records,
            userHasDefaultCategory
          );
          return response.json(
            `deleted ${userHasCategory.categoryName} and moved it's records in default category`
          );
        } else {
          //if user has not default category, craeting default
          //category and moving records in to default category
          const createDefaultCategory = await categoryService.createCategory(
            "default",
            userExsists
          );

          await recordService.moveRecordsToDefaultCategory(
            records,
            createDefaultCategory
          );
          return response.json(
            `deleted ${userHasCategory.categoryName}, created default category and moved ${userHasCategory.categoryName} records in default `
          );
        }
      } else {
        return response.json("user doesnot have a category with this id");
      }
    } else {
      throw new Error("user doesnt exsists or password is incorrect");
    }
  } catch (err) {
    next(err);
  }
};
