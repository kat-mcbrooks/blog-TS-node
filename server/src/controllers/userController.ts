import { NextFunction, Request, Response } from "express"; // im not sure this is needed? Do we need to import these in?
import User from "../models/userModel";
import logging from "../config/logging";

const validate = (req: Request, res: Response, next: NextFunction) => {
  logging.info("Token validated, returning user...");
  let firebase = res.locals.firebase; // this line isn't necessary but it means we can return certain information
  return User.findOne({ uid: firebase.uid })
    .then((user) => {
      if (user) {
        return res.status(200).json({ user });
      } else {
        return res.status(401).json({
          message: "user not found",
        });
      }
    })
    .catch((error) => {
      logging.error(error);
      return res.status(500).json({ error });
    });
};

const create = (req: Request, res: Response, next: NextFunction) => {};

const login = (req: Request, res: Response, next: NextFunction) => {};

const read = (req: Request, res: Response, next: NextFunction) => {};

const readAll = (req: Request, res: Response, next: NextFunction) => {};

export default {
  validate,
  create,
  login,
  read,
  readAll,
};
