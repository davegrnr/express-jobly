const jwt = require("jsonwebtoken");
const Router = require("express").Router;
const router = new Router();

const User = require("../models/user");
const {SECRET_KEY} = require("../config");
const ExpressError = require("../expressError");

router.get("/", async (req, res) => {
    res.send("Root auth route working")
})

// Register user and assign token
router.post("/register", async  (req, res, next) => {
    try {
      let {username} = await User.register(req.body);
      let token = jwt.sign({username}, SECRET_KEY);
      User.updateLoginTimestamp(username);
      return res.json({token});
    }
  
    catch (err) {
      return next(err);
    }
  });

//   Log user in and assign token
router.post("/login", async (req, res, next) => {
  try{
      const { username, password } = req.body;
      if (await User.authenticate(username, password)){
          let token = jwt.sign({username}, SECRET_KEY);
          User.updateLoginTimestamp(username);
          return res.json({token});
      } else {
          throw new ExpressError("Invalid username/password combination", 400)
      }
  } catch(e) {

  }
})



module.exports = router;