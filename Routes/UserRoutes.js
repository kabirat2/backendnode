const express = require("express")
const router = express.Router()
const {SignUp, Login,  EditAcc, deleteAccount} = require("../Controllers/UserController")
const veriftyToken = require("../Middlewares/veriftytoken")
const { validateMiddleware } = require("../Middlewares/validator")
const {validateUserSignUp } = require("../Middlewares/uservalidator")

router.post("/sign-up",validateMiddleware(validateUserSignUp), SignUp)
router.post("/log-in", Login)
// Private Route
router.put("/editAcc", veriftyToken, EditAcc)
router.put("/deleAcc", veriftyToken, deleteAccount)
// router.put("/editPassword", veriftytoken, editPassword)
// router.post("/editUserInfo", veriftytoken, editUserInfo)
module.exports = router


