import { getRepository } from "typeorm";

import { Category } from "../entities/category.entity";
import { User } from "../entities/user.entity";
export class CategoryService {
  public categoryRepo = getRepository(Category);
  public userRepo = getRepository(User);

  public async changeCategoryNameById(id, newCategoryName): Promise<Boolean> {
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
}
