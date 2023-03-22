import { Any } from "typeorm";
import { myDataSource } from "../database/db.config";
import { Category } from "../entities/category.entity";
import { Records } from "../entities/records.entity";
import { User } from "../entities/user.entity";
import { RecordTypeEnum } from "../enums/records.enum";
import { datetime } from "../helper/helper";
import { AuthService } from "./auth.service";

export class RecordService {
  public categoryRepo = myDataSource.getRepository(Category);
  public userRepo = myDataSource.getRepository(User);
  public recordRepo = myDataSource.getRepository(Records);

  public async createRecord(
    record: {
      descriotion: string;
      status: string;
      price: string;
      type: RecordTypeEnum;
    },
    category: Category[]
  ) {
    try {
      category.map(async (data) => {
        const createRecord = new Records();
        createRecord.descriotion = record.descriotion;
        createRecord.price = parseInt(record.price);
        createRecord.type = record.type;
        createRecord.createdAt = datetime();
        createRecord.status = record.type == "outcome" ? record?.status : null;

        createRecord.category = data;

        await this.recordRepo.save(createRecord);
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  public async getRecordsByCategory(catgory: Category) {
    const records = await this.recordRepo.find({
      relations: {
        category: true,
      },
      where: {
        category: catgory,
      },
    });

    return records;
  }

  public async getAllRecords(userName: string, data: Parameter) {
    const userService = new AuthService();
    const user = await userService.getUser(userName);

    try {
      const categories = await this.categoryRepo.find({
        where: {
          user: user,
        },
      });

      if (!categories.length)
        throw new Error("user doesnt have any categories");

      let records: Array<Records> = await this.recordRepo
        .createQueryBuilder("record")
        .leftJoinAndSelect("record.category", "category")
        .where("record.price < :price", {
          price: data.maxPrice ? data.maxPrice : 999999999,
        })
        .andWhere("record.price > :minPrice", {
          minPrice: data.minPrice ? data.minPrice : 0,
        })
        .andHaving("record.type IN (:...type)", {
          type:
            (data.income && data.outcome) || (!data.income && !data.outcome)
              ? ["income", "outcome"]
              : data.income
              ? ["income"]
              : data.outcome
              ? ["outcome"]
              : null,
        })
        .andHaving("record.category IN (:...category)", {
          category: categories.map((category) => category.id),
        })
        .addGroupBy("record.id")
        .addGroupBy("category.id")
        .getMany();

      if (data.status)
        records = records.filter((record) => record.status == data.status);

      if (data.maxDate)
        records = records.filter(
          (record) => Date.parse(record.createdAt.toString()) < data.maxDate
        );

      if (data.minDate)
        records = records.filter(
          (record) => Date.parse(record.createdAt.toString()) > data.minDate
        );

      return records;
    } catch (err) {
      throw new Error(err);
    }
  }

  public async moveRecordsToDefaultCategory(
    records: Array<Records>,
    category: Category
  ) {
    records.map(async (data) => {
      data.category = category;
      await this.recordRepo.save(data);
    });
  }
}
