const express = require("express")
const { createpostproject } = require("../Controllers/userPostproject")

const router = express.Router()

router.post("/uploadPost", createpostproject)

module.exports = router;