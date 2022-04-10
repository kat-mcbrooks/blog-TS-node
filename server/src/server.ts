import http from "http";
import express from "express";
import logging from "../config/logging";
import config from "../config/config";
import mongoose from "mongoose";
import firebaseAdmin from "firebase-admin";

const router = express();
// Server Handling
const httpServer = http.createServer(router);
// connect to Firebase on the Admin side in order to authenticate the token provided by the client side
const serviceAccountKey = require("./config/serviceaccountkey.json");

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccountKey),
});

// Connect to Mongo
mongoose
  .connect(config.mongo.url, config.mongo.options)
  .then((result) => {
    logging.info("MongoDB Connected");
  })
  .catch((error) => {
    logging.error(error);
  });

// logging middleware

router.use((req, res, next) => {
  logging.info(
    `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
  );

  res.on("finish", () => {
    logging.info(
      `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`
    );
  });

  next();
});

// Parse the body of the request. This allows the server to read the incoming requests and their body as json format
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// Rules of our API i.e. basically telling us where we are allowed to make requests from
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // * so we can access this API from anwywhere
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization" // any other header is not going to be accepted
  );

  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }

  next();
});

//routes

//error handling
router.use((req, res, next) => {
  const error = new Error("Not found");

  res.status(404).json({
    message: error.message,
  });
});

// Listen for requests, 'turn on' server
httpServer.listen(config.server.port, () =>
  logging.info(`Server is running ${config.server.host}:${config.server.port}`)
);
