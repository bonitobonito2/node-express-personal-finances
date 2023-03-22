import { RequestHandler, response } from "express";
import { AuthService } from "../../service/auth.service";
import { CategoryService } from "../../service/category.service";
import { RecordService } from "../../service/record.service";

export const createRecord: RequestHandler = async (request, response, next) => {
  const userName = request["decoded"]["userName"];

  const categoryName = request?.body["categoryName"];
  const price = request.body["price"];
  const description = request.body["description"];
  const status = request?.body["status"];
  const type = request.body["type"];
  const authService = new AuthService();
  const categoryService = new CategoryService();
  const recordService = new RecordService();

  try {
    if (price < 0) {
      throw new Error("Price cannot be less than zero.");
    }
    if (type == "outcome" && status == undefined) {
      throw new Error(
        "outcome record needs to have a status, [Processing, Completed]"
      );
    }
    const userExsists = await authService.getUser(userName);

    const userHasCategory = categoryName
      ? await categoryService.userHasCategoryByName(categoryName, userExsists)
      : false;
    if (typeof userHasCategory !== "boolean") {
      await recordService.createRecord(
        {
          descriotion: description,
          price: price,
          status: status,
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
            status: status,
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
            status: status,
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

export const getFilteredRecord: RequestHandler = async (req, res, next) => {
  const userName = req["decoded"]["userName"];

  try {
    const income = req.query["income"] == "true" ? true : null;
    const outcome = req.query["outcome"] == "true" ? true : null;
    const status = req.query["status"] ? req.query["status"].toString() : null;
    const maxDate = req.query["maxDate"]
      ? req.query["maxDate"].toString()
      : null;

    const minDate = req.query["minDate"]
      ? req.query["minDate"].toString()
      : null;

    const maxPrice = req.query["maxPrice"]
      ? parseInt(req.query["maxPrice"].toString())
      : null;

    const minPrice = req.query["minPrice"]
      ? parseInt(req.query["minPrice"].toString())
      : null;

    if (status !== null && status !== "Processing" && status !== "Completed") {
      throw new Error(
        "status query parameter can only be Processing OR Completed"
      );
    }

    const recordService = new RecordService();

    const records = await recordService.getAllRecords(userName, {
      income: income,
      outcome: outcome,
      maxPrice: maxPrice,
      minPrice: minPrice,
      status: status,
      maxDate: !Number.isNaN(Date.parse(maxDate)) ? Date.parse(maxDate) : null,
      minDate: !Number.isNaN(Date.parse(minDate)) ? Date.parse(minDate) : null,
    });
    return res.json(records);
  } catch (err) {
    next(err);
  }
};
