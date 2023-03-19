import { myDataSource } from "../database/db.config";
import { Category } from "../entities/category.entity";
import { Records } from "../entities/records.entity";
import { User } from "../entities/user.entity";
import { RecordTypeEnum } from "../enums/records.enum";

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
    category.map(async (data) => {
      const createRecord = new Records();
      createRecord.descriotion = record.descriotion;
      createRecord.price = record.price;
      createRecord.type = record.type;

      if (record.type == "outcome") {
        if (record.process == undefined)
          throw new Error(
            "outcome record needs to have a process, [Processing, Completed]"
          );
        createRecord.status = record?.process;
      }
      createRecord.category = data;
      if (createRecord.category) {
        await this.recordRepo.save(createRecord);
      }
    });
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
