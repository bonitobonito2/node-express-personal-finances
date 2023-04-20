import { RequestHandler, response } from "express";
import { sendMeil } from "../../helper/sendMeil";
import { AuthService } from "../../service/auth.service";

import jwt from "jsonwebtoken";
export const registration: RequestHandler = async (request, response, next) => {
  const email = request.body["email"];
  const password = request.body["password"];
  const authService = new AuthService();

  const userExsists = await authService.getUser(email);
  const token = jwt.sign({ email: email }, "topSecret21", {
    expiresIn: "900000",
  });

  if (userExsists && userExsists.verifed) {
    return response.status(404).json("user with this email already exsists");
  } else if (userExsists && !userExsists.verifed) {
    await sendMeil(email, "content", token);
    return response
      .status(401)
      .json(
        "user is already in database, but email is not verifed, we send u email verification once again."
      );
  }

  if (await authService.createUser({ email: email, password: password })) {
    await sendMeil(email, "content", token);

    return response.json(
      `${email} created, we send u verife code on email, u have 15 minutes to verife`
    );
  }
  return response.status(403).json("something went wrong");
};

export const login: RequestHandler = async (request, response, next) => {
  const email = request.body["email"];
  const password = request.body["password"];
  const authService = new AuthService();

  const userExsists = await authService.getUser(email);

  if (!userExsists) {
    return response.json("user doesnot exsists");
  }
  if (userExsists.password == password) {
    const token = jwt.sign({ email: userExsists.email }, "topSecret21", {
      expiresIn: "1d",
    });
    return response.json({ succses: true, token: token });
  } else {
    return response.status(404).json("incorrect password");
  }
};

export const changePassword: RequestHandler = async (
  request,
  response,
  next
) => {
  const gmail = request.body["gmail"];
  const currentPassword = request.body["currentPassword"];
  const newPassword = request.body["newPassword"];

  const authService = new AuthService();

  const userExsts = await authService.getUser(gmail);
  if (userExsts && currentPassword == userExsts.password) {
    const passwordChanged = await authService.changePassword(
      userExsts.email,
      newPassword
    );

    return response.json({ passwordChanged });
  } else {
    return response
      .status(404)
      .json("user doesnot exsists or current password is incorrect");
  }
};

export const verifeEmail: RequestHandler = async (request, response, next) => {
  const token = request.params.verifeKey;
  const authService = new AuthService();

  try {
    const decoded = jwt.verify(token, "topSecret21");
    const email = decoded["email"];
    const verifeEmail = await authService.verifeEmail(email);
    return response.json("email verifed");
  } catch (err) {
    throw new err("something went wrong");
  }
};
