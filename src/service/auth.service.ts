import { Repository, getRepository } from "typeorm";
import { User } from "../entities/user.entity";
import { userInterface } from "../interfaces/user.interface";
import { myDataSource } from "../database/db.config";

export class AuthService {
  public userRepo = myDataSource.getRepository(User);

  public async getUser(userName: string): Promise<User> {
    try {
      return await this.userRepo.findOneBy({ username: userName });
    } catch (err) {
      throw new Error(err);
    }
  }

  public async createUser(userInfo: userInterface): Promise<boolean> {
    try {
      const data = await this.userRepo.insert({
        username: userInfo.userName,
        password: userInfo.password,
      });

      if (data) return true;
      return false;
    } catch (err) {
      throw new Error(err);
    }
  }

  public async changePassword(
    userName: string,
    password: string
  ): Promise<Boolean> {
    try {
      const user = await this.getUser(userName);
      user.password = password;

      if (await this.userRepo.save(user)) return true;
      return false;
    } catch (err) {
      throw new Error(err);
    }
  }
}
