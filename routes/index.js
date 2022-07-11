const router = require("express").Router();
const User = require("../models/User.model")
const bcryptJs = require("bcryptjs")

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});


/* REGISTRATION */
router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  //const password = req.body.password
  const cryptedPassword = bcryptJs.hashSync(req.body.password)

  const newUser = new User ({
    username: username,
    password: cryptedPassword,
  })

  newUser.save()
    .then( newUser => {
      console.log('user saved', newUser)
      res.redirect("/")
    })
    .catch(err => {
      console.log('user not saved', err)
    })
})

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

/* LOGIN */
router.post("/login", (req, res, next) => {
  User.findOne({email:req.body.email})
  .then(function(userFromDB) {
    if(!userFromDB) {
      res.redirect("/")
    } else {
      if (bcrypt.compareSync(req.body.password, userFromDB.password) === true)
      { req.session.userLogged = userFromDB;
        res.render("login", {userFromDB})
      }
    } //else {}
    })
  })

  router.get("/login", (req, res, next) => {
    res.render("login");
  });
  



module.exports = router;
