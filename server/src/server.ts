import http from "http";
import express from "express";
import logging from "../config/logging";
import config from "../config/config";
import connectDB from "../config/db";
import firebaseAdmin from "firebase-admin";
const dotenv = require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

// connect to Firebase on the Admin side in order to authenticate the token provided by the client side
const serviceAccountKey = require("../config/serviceaccountkey.json");

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccountKey),
});

// logging middleware
app.use((req, res, next) => {
  logging.info(
    `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
  );

  res.on("finish", () => {
    logging.info(
      `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`
    );
  });

  next(); //next is a function in express that allows the function to continue to the next piece of middleware. We have to put this, otherwise the request will get stuck here.
});

// Parse the body of the request. This allows the server to read the incoming requests and their body as json format
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rules of our API i.e. basically telling us where we are allowed to make requests from
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // * so we can access this API from anwywhere
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization" // any other header is not going to be accepted
  );

  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }

  next(); //
});

//routes

//error handling
app.use((req, res, next) => {
  const error = new Error("Not found");

  res.status(404).json({
    message: error.message,
  });
});

// Listen for requests, 'turn on' server
app.listen(port, () => {
  // Connect to Mongo (see config/db.ts)
  connectDB();
  console.log(`Server started on port ${port}`);
});
// httpServer.listen(config.server.port, () =>
//   logging.info(`Server is running ${config.server.host}:${config.server.port}`)
// );
