const express = require("express");
const xss = require("xss");
const AuthService = require("./auth-service");
const authRouter = express.Router();
const { requireAuth } = require("../middleware/jwt-auth");

authRouter
  .route("/login")
  .all((req, res, next) => {
    knexInstance = req.app.get("db");
    next();
  })
  .get(requireAuth, (req, res) => {
    return res.json(req.user);
  })

  .post((req, res, next) => {
    const { password, userName } = req.body;
    const user = { password, userName };
    for (const field of ["userName", "password"]) {
      if (!req.body[field]) {
        return res.status(400).json({
          error: `Missing ${field}`,
        });
      }
    }
    AuthService.getUserWithEmail(knexInstance, userName).then((dbUser) => {
      if (!dbUser) {
        return res.status(400).json({
          error: "Incorrect email or password",
        });
      }
      AuthService.comparePasswords(knexInstance, password).then((isMatch) => {
        if (!isMatch) {
          return res.status(400).json({
            error: "Incorrect email or password",
          });
        }

        const subject = dbUser.username;
        const payload = { user_id: dbUser.id };
        res.send({
          authToken: AuthService.createJwt(subject, payload),
        });
      });
    });
  });

module.exports = authRouter;
