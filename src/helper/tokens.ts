import jwt from "jsonwebtoken";

export const getTokenForValidation = (email: string): string => {
  return jwt.sign({ email: email }, "topSecret21", {
    expiresIn: "900000",
  });
};

export const getTokenForAuthentificaion = (email: string): string => {
  return jwt.sign({ email: email }, "topSecret21", {
    expiresIn: "1d",
  });
};
