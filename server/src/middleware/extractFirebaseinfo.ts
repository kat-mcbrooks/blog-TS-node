//responsible for takingthe firebase token adn then checking with the Firebase admin and checking to see if this is a valid user or not. If it iis, it will return the user data. If not, we just return some form of status 401 unauthorized

import logging from "../config/logging";
import firebaseAdmin from "firebase-admin";
import { Request, Response, NextFunction } from "express"; //import the definitions that we will need for the middleware

const extractFirebaseInfo = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logging.info("validating firebase token...");
  let token = req.headers.authorization?.split(" ")[1]; //this is how we get the bearer token. We get it like this because the format is Bearer then a space then the token.
  if (token) {
    firebaseAdmin
      .auth()
      .verifyIdToken(token)
      .then((result) => {
        if (result) {
          res.locals.firebase = result; // if there is a result, we add the result data to our response
          res.locals.fire_token = token; //can also pass the token
          next();
        } else {
          logging.warn("Token invalid, Unauthorized");

          return res.status(401).json({
            message: "Unauthorized",
          });
        }
      })
      .catch((error) => {
        logging.error(error);

        return res.status(401).json({
          error,
          message: "Unauthorized",
        });
      });
  } else {
    // else if the token does not exist:
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};

export default extractFirebaseInfo;
