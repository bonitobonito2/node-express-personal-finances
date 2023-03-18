import { RequestHandler, Router } from "express";
import { AuthService } from "../../service/auth.service";
import { CategoryService } from "../../service/category.service";

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
      const createCategory = await categoryService.createCategory(
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
