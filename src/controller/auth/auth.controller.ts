import { RequestHandler, response } from "express";
import { AuthService } from "../../service/auth.service";
import { request } from "http";

export const registration: RequestHandler = async (request, response, next) => {
  const userName = request.body["userName"];
  const password = request.body["password"];
  const authService = new AuthService();

  const userExsists = await authService.getUser(userName);
  if (userExsists) {
    return response.status(404).json("user with this userName already exsists");
  }
  if (await authService.createUser({ userName: userName, password: password }))
    return response.json(`${userName} created`);
  return response.status(403).json("something went wrong");
};

export const login: RequestHandler = async (request, response, next) => {
  const userName = request.body["userName"];
  const password = request.body["password"];
  const authService = new AuthService();

  const userExsists = await authService.getUser(userName);

  if (!userExsists) {
    return response.json("user doesnot exsists");
  }
  if (userExsists.password == password) {
    return response.json({ succses: true });
  } else {
    return response.status(404).json("incorrect password");
  }
};

export const changePassword: RequestHandler = async (
  request,
  response,
  next
) => {
  const userName = request.body["userName"];
  const currentPassword = request.body["currentPassword"];
  const newPassword = request.body["newPassword"];

  const authService = new AuthService();

  const userExsts = await authService.getUser(userName);
  if (userExsts && currentPassword == userExsts.password) {
    const passwordChanged = await authService.changePassword(
      userExsts.username,
      newPassword
    );

    return response.json({ passwordChanged });
  } else {
    return response
      .status(404)
      .json("user doesnot exsists or current password is incorrect");
  }
};
