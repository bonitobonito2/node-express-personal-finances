import { RequestHandler } from "express";
import { AuthService } from "../../service/auth.service";
import { CategoryService } from "../../service/category.service";
import { RecordService } from "../../service/record.service";

export const createRecord: RequestHandler = async (request, response, next) => {
  const userName = request["decoded"]["userName"];

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

    const userHasCategory = categoryName
      ? await categoryService.userHasCategoryByName(categoryName, userExsists)
      : false;
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
      return response.json(`record created  `);
    } else {
      const createDefaultCategory =
        await categoryService.createCategoryAndCheck("default", userExsists);
      if (typeof createDefaultCategory !== "string") {
        //default category doesnot exsists for this user
        await recordService.createRecord(
          {
            descriotion: description,
            price: price,
            process: process,
            type: type,
          },
          [createDefaultCategory]
        );
        return response.json(
          "created default category and added record in default due to category field with given name doesnot exsists or  is undefined"
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
          [getCategory]
        );
        response.json(
          "added record in default  category due to category field with given name doesnot exsists or  is undefined"
        );
      }
    }
  } catch (err) {
    next(err);
  }
};
