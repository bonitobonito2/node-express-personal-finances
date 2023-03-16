import { RequestHandler } from "express";

export const createCategory: RequestHandler = async (
  request,
  response,
  next
) => {
  const userName = request.body["userName"];
  const password = request.body["password"];
};
