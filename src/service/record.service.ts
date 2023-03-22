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
        createRecord.price = parseInt(record.price);
        createRecord.type = record.type;
        createRecord.createdAt = datetime();
        createRecord.status = record.type == "outcome" ? record?.process : null;

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
      if (!categories.length) {
        throw new Error("user doesnt have any categories");
      }
      const fileteredCategories = categories.map((data) => data.id);

      if ((data.income && data.outcome) || (!data.income && !data.outcome)) {
        let records = await this.recordRepo
          .createQueryBuilder("record")
          .where("record.price < :price", {
            price: data.maxPrice ? data.maxPrice : 9999999,
          })
          .andWhere("record.price > :minPrice", {
            minPrice: data.minPrice ? data.minPrice : 0,
          })
          .leftJoinAndSelect("record.category", "category")
          .andHaving("record.category IN (:...category)", {
            category: fileteredCategories,
          })
          .addGroupBy("record.id")
          .addGroupBy("category.id")
          .getMany();

        if (data.status) {
          records = records.filter((record) => record.status == data.status);
        }

        if (data.maxDate) {
          records = records.filter(
            (record) => Date.parse(record.createdAt.toString()) < data.maxDate
          );
        }

        if (data.minDate) {
          records = records.filter(
            (record) => Date.parse(record.createdAt.toString()) > data.minDate
          );
        }
        return records;
      } else {
        let records = await this.recordRepo
          .createQueryBuilder("record")
          .where("record.price < :price", {
            price: data.maxPrice ? data.maxPrice : 9999999,
          })
          .andWhere("record.price > :minPrice", {
            minPrice: data.minPrice ? data.minPrice : 0,
          })
          .andWhere("record.type = :income", {
            income: data.income ? "income" : "outcome",
          })
          .andWhere("record.type = :outcome", {
            outcome: data.outcome ? "outcome" : "income",
          })
          .leftJoinAndSelect("record.category", "category")
          .andHaving("record.category IN (:...category)", {
            category: fileteredCategories,
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
      }
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
