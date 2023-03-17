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
        return response.status(403).json("category already exsists");

      return response
        .status(200)
        .json({ data: `category ${categoryName} created` });
    } else {
      return response.status(403).json("username or password is uncorrect");
    }
  } catch (err) {
    next(new Error(err));
  }
};
