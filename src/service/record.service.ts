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
    category: Category
  ) {
    const createRecord = new Records();
    createRecord.descriotion = record.descriotion;
    createRecord.price = record.price;
    createRecord.type = record.type;
    if (record.type == "outcome") {
      createRecord.process = record.process;
    }
    createRecord.category = category;
    await this.recordRepo.save(createRecord);
  }
}
