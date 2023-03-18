import { getRepository } from "typeorm";

import { Category } from "../entities/category.entity";
import { User } from "../entities/user.entity";
import { myDataSource } from "../database/db.config";
export class CategoryService {
  public categoryRepo = myDataSource.getRepository(Category);
  public userRepo = myDataSource.getRepository(User);

  public async changeCategoryNameById(
    id: number,
    newCategoryName: string
  ): Promise<Boolean> {
    const category = await this.categoryRepo.findOneBy({ id: id });

    category.categoryName = newCategoryName;
    if (await this.categoryRepo.save(category)) return true;
    return false;
  }
  public async createCategory(categoryName: string, user: User) {
    const categoryExsists = await this.userRepo.find({
      relations: {
        category: true,
      },
      where: {
        category: {
          user: user,
          categoryName: categoryName,
        },
      },
    });

    if (categoryExsists.length) return "category already exsists";

    const category = new Category();
    category.categoryName = categoryName;
    category.user = user;

    await this.categoryRepo.save(category);
  }

  public async userHasCategory(
    id: number,
    user: User
  ): Promise<Category | boolean> {
    try {
      const categoryExsists = await this.categoryRepo.findOne({
        where: {
          user: user,
          id: id,
        },
      });
      if (categoryExsists) {
        return categoryExsists;
      }
      return false;
    } catch (err) {
      throw new Error(err);
    }
  }
}
