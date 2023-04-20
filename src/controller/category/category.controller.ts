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

  const email = request["decoded"]["email"];
  const categoryName = request.body["categoryName"];

  try {
    const userExsists = await authService.getUser(email);
    delete userExsists.password;
    const createCategory = await categoryService.createCategoryAndCheck(
      categoryName,
      userExsists
    );
    if (createCategory == "category already exsists")
      return response
        .status(403)
        .json({ info: "category already exsists", user: userExsists });

    return response
      .status(200)
      .json({ info: `category ${categoryName} created`, user: userExsists });
  } catch (err) {
    next(err);
  }
};

export const changeCategoryName: RequestHandler = async (
  request,
  response,
  next
) => {
  const email = request["decoded"]["email"];
  const newCategoryName = request.body["newCategoryName"];

  const categoryId = parseInt(request.params.id);
  const categoryService = new CategoryService();
  const authService = new AuthService();

  try {
    const userExsists = await authService.getUser(email);
    delete userExsists.password;
    const categoryExsists = await categoryService.userHasCategory(
      categoryId,
      userExsists
    );
    if (categoryExsists) {
      await categoryService.changeCategoryNameById(categoryId, newCategoryName);

      return response.json({
        info: `category name changed with id ${categoryId} changed to ${newCategoryName}`,
        user: userExsists,
      });
    } else {
      return response.status(403).json({
        info: `you dont have category with the id (${categoryId})`,
        user: userExsists,
      });
    }
  } catch (err) {
    next(err);
  }
};

export const deleteCategory: RequestHandler = async (
  request,
  response,
  next
) => {
  const email = request["decoded"]["email"];

  const categoryId = parseInt(request.params["id"]);

  const authService = new AuthService();
  const categoryService = new CategoryService();
  const recordService = new RecordService();

  try {
    const userExsists = await authService.getUser(email);

    delete userExsists.password;

    const userHasCategory = await categoryService.userHasCategory(
      categoryId,
      userExsists
    );

    if (typeof userHasCategory !== "boolean") {
      //getting records of this category
      const records = await recordService.getRecordsByCategory(userHasCategory);

      //deleting categories and it's records
      await categoryService.deleteCategory(userHasCategory, records);

      //checking if user has a default category
      const userHasDefaultCategory =
        await categoryService.userHasCategoryByName(["default"], userExsists);
      if (typeof userHasDefaultCategory !== "boolean") {
        //if user has a default category, moving old records in default
        await recordService.moveRecordsToDefaultCategory(
          records,
          userHasDefaultCategory[0]
        );
        return response.json({
          info: `deleted ${userHasCategory.categoryName} and moved it's records in default category`,
          user: userExsists,
        });
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
        return response.json({
          info: `deleted ${userHasCategory.categoryName}, created default category and moved ${userHasCategory.categoryName} records in default `,
          user: userExsists,
        });
      }
    } else {
      return response.json({
        info: "user doesnot have a category with this id",
        user: userExsists,
      });
    }
  } catch (err) {
    next(err);
  }
};
