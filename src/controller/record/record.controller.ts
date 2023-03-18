import { RequestHandler } from "express";
import { AuthService } from "../../service/auth.service";
import { CategoryService } from "../../service/category.service";
import { RecordService } from "../../service/record.service";

export const createRecord: RequestHandler = async (request, response, next) => {
  const userName = request.body["userName"];
  const password = request.body["password"];
  const categoryName = request?.body["categoryName"];
  const price = request.body["price"];
  const description = request.body["description"];
  const process = request?.body["process"];
  const type = request.body["type"];
  const authService = new AuthService();
  const categoryService = new CategoryService();
  const recordService = new RecordService();
  try {
    const userExsists = await authService.getUser(userName);
    if (userExsists && userExsists.password == password) {
      const userHasCategory = await categoryService.userHasCategoryByName(
        categoryName,
        userExsists
      );
      if (typeof userHasCategory !== "boolean") {
        await recordService.createRecord(
          {
            descriotion: description,
            price: price,
            process: process,
            type: type,
          },
          userHasCategory
        );
        return response.json(
          `record created in ${userHasCategory.categoryName} category `
        );
      } else {
        const createDefaultCategory = await categoryService.createCategory(
          "default",
          userExsists
        );
        if (typeof createDefaultCategory !== "string") {
          //default category doesnot exsists for this user
          await recordService.createRecord(
            {
              descriotion: description,
              price: price,
              process: process,
              type: type,
            },
            createDefaultCategory
          );
          return response.json(
            "created default category and added in default due to category field with given name doesnot exsists or  is undefined"
          );
        } else {
          // default category already exsists for this user
          const getCategory = await categoryService.categoryRepo.findOne({
            where: {
              categoryName: "default",
              user: userExsists,
            },
          });

          await recordService.createRecord(
            {
              descriotion: description,
              price: price,
              process: process,
              type: type,
            },
            getCategory
          );
          response.json(
            "added in default  category due to category field with given name doesnot exsists or  is undefined"
          );
        }
      }
    } else {
      throw new Error("user doesnt exsists or password is incorrect");
    }
  } catch (err) {
    next(new Error(err));
  }
};
