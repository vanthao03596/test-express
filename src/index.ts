import express from 'express';
import session from 'express-session';
import bodyParser  from 'body-parser';
import flash  from 'express-flash';
import path from 'path';
import compression from "compression";
import redis from 'redis';
import connectRedis from "connect-redis";

import * as userController from "./controllers/login";
import * as homeController from "./controllers/home";

const app = express();
const PORT = 8000;
const SESSION_SECRET = 'xxx';

const RedisStore = connectRedis(session);
const redisClient  = redis.createClient();

app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "pug");
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    name: 'douma-session',
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "lax", // csrf
        secure: false,
      },
      saveUninitialized: false,
      secret: SESSION_SECRET,
      resave: false,
}));
app.use(flash());

app.get("/", homeController.index);
app.get("/login", userController.getLogin);
app.post("/postLogin", userController.postLogin);

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});