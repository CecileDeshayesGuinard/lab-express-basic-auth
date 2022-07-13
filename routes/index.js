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

  if (username === "" || req.body.password === ""){
    res.render("signup", {
      message: "Veuillez remplir tous les champs"
      })
  }

  // Regarde dans la DB si l'utilisateur existe
  User.findOne({username : username})
  .then((user)=>{
    if (user) {
      // Il existe --> Affiche un message
      res.render("signup", {
        message: `Le nom d'utilisateur ${user.username} est deja pris`
      })
    } else {
      // Il n'existe pas --> Creation du compte
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
    
    }
  })
  .catch(err => next(err))
})

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

/* LOGIN */
router.post("/login", (req, res, next) => {
  // Regarde dans la DB le mail
  User.findOne({username:req.body.username})
  .then(function(userFromDB) {
    if(!userFromDB) { // Si l'utilisateur n'est pas dans la DB
      res.render("login", {
        message : "Nom d'utilisateur non existant"
      })
    } else { // S'il l'est
      console.log(userFromDB)
      if (bcryptJs.compareSync(req.body.password, userFromDB.password)) // Compare le mdp rentré dans le champ et celui de la BD crypté
        { 
          // Si le mdp est bon
          console.log("req.session = ",req.session)
          req.session.userLogged = userFromDB
          res.redirect("/main")
        }else{
        // Si le mdp est pas bon
          res.render("login", {
            message : "Mauvais mot de passe"
          })
        }
    }
  })
})

  router.get("/main", (req, res, next) =>{
    if(!req.session.userLogged) {
      res.redirect("/login")
      //next()
      return
    }

    res.render("private-main", {
      user : req.session.userLogged
    })
  })

  router.get("/private", (req, res, next) =>{
    if(!req.session.userLogged) {
      res.redirect("/login")
      return
    }

    res.render("private", {
      user : req.session.userLogged
    })
  })

  router.get("/login", (req, res, next) => {
    res.render("login");
  });

  router.post("/logout", (req, res, next) => {
    req.session.destroy();
    res.redirect('/');
  });
  



module.exports = router;
