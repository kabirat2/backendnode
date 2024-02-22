const express = require("express")
const router = express.Router()
const {SignUp, Login} = require("../Controllers/UserController")

router.post("/sign-up", SignUp)
router.post("/login", Login)

module.exports = router

