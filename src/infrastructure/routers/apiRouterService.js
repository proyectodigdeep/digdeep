// Librerías externas
var express = require("express")
var router = express.Router()

var servicesService = require("../services/servicesService") // Este es un servicio especifico para servicios

router.post("/services", servicesService.createService)
router.get("/services", servicesService.getServices)
router.get("/services/:id",servicesService.getService)
router.get("/servicesbydigdeeper/:id",servicesService.getServicesByDigdeeper)
router.get("/servicesbydigdeepercomments/:id",servicesService.getServicesByDigdeeperComments)
//router.put("/services/:id",servicesService.updateService)
router.delete("/services:id",servicesService.deleteService)
// Exportar el módulo de rutas para API
module.exports = router