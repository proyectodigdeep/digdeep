var express = require("express")
var router = express.Router()

var webService = require("./services/webService")

//Rutas accesibles desde web
router.get("/", webService.home)

module.exports = router