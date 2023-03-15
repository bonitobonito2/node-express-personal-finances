import { getRepository } from "typeorm";
import { User } from "../entities/user.entity";
import { userInterface } from "../interfaces/user.interface";

export class AuthService {
  public userRepo = getRepository(User);

  public async getUser(userName: string): Promise<User> {
    return await this.userRepo.findOneBy({ username: userName });
  }

  public async createUser(userInfo: userInterface): Promise<boolean> {
    const data = await this.userRepo.insert({
      username: userInfo.userName,
      password: userInfo.password,
    });

    if (data) return true;
    return false;
  }

  public async changePassword(
    userName: string,
    password: string
  ): Promise<Boolean> {
    const user = await this.getUser(userName);

    user.password = password;
    if (await this.userRepo.save(user)) return true;
    return false;
  }
}
