import { Category } from "../entities/category.entity";
import { User } from "../entities/user.entity";
import { myDataSource } from "../database/db.config";
import { Records } from "../entities/records.entity";
import { datetime } from "../helper/helper";
export class CategoryService {
  public categoryRepo = myDataSource.getRepository(Category);
  public userRepo = myDataSource.getRepository(User);
  public recordRepo = myDataSource.getRepository(Records);
  public async changeCategoryNameById(
    id: number,
    newCategoryName: string
  ): Promise<Boolean> {
    const category = await this.categoryRepo.findOneBy({ id: id });

    category.categoryName = newCategoryName;
    if (await this.categoryRepo.save(category)) return true;
    return false;
  }
  public async createCategoryAndCheck(categoryName: string, user: User) {
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
    category.createdAt = datetime();
    category.user = user;

    return await this.categoryRepo.save(category);
  }

  public async createCategory(categoryName: string, user: User) {
    const category = new Category();
    category.categoryName = categoryName;
    category.createdAt = datetime();
    category.user = user;

    return await this.categoryRepo.save(category);
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

  public async userHasCategoryByName(
    categoryName: Array<string>,
    user: User
  ): Promise<Category[] | boolean> {
    try {
      let categories = await Promise.all(
        categoryName.map(async (data): Promise<Category> => {
          const categoryExsists = await this.categoryRepo.findOne({
            where: {
              user: user,
              categoryName: data,
            },
          });
          if (categoryExsists !== null && categoryExsists !== undefined)
            return categoryExsists;
        })
      );
      categories = categories.filter((data) => data !== undefined);
      if (categories.length && categories !== undefined) {
        return categories;
      } else {
        return false;
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  public async deleteCategory(category: Category, record: Array<Records>) {
    record.map(async (data) => {
      await this.recordRepo.delete({ id: data.id });
    });
    return await this.categoryRepo.delete(category);
  }
}
