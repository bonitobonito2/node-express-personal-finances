import { NextFunction } from "express";
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
      process: string;
      price: string;
      type: RecordTypeEnum;
    },
    category: Category[]
  ) {
    try {
      category.map(async (data) => {
        const createRecord = new Records();
        createRecord.descriotion = record.descriotion;
        createRecord.price = record.price;
        createRecord.type = record.type;
        createRecord.createdAt = datetime();
        createRecord.status = record.type == "outcome" ? record?.process : null;

        createRecord.category = data;

        await this.recordRepo.save(createRecord);
      });
    } catch (err) {
      console.log("1111111111");
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

  public async getAllRecords(userName: string) {
    const userService = new AuthService();
    const user = await userService.getUser(userName);

    const categories = await this.categoryRepo.find({
      where: {
        user: user,
      },
    });
    const records = await this.recordRepo.find({
      relations: {
        category: true,
      },
      where: {
        type: RecordTypeEnum.OUTCOME,
        category: categories,
      },
      order: {
        createdAt: "DESC",
      },
    });

    return records;
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
