// Librerías externas
var express = require("express")
var router = express.Router()

var servicesService = require("../services/servicesService") // Este es un servicio especifico para servicios
// Crear un servicio
router.post("/services", servicesService.createService)
// Obtener todos los servicios registrados en  digdeep
router.get("/services", servicesService.getServices)
// Obtener un servicio por id del servicio
router.get("/services/:id",servicesService.getService)
// Obtener todos los servicios de un proveedor
router.get("/servicesbydigdeeper/:id",servicesService.getServicesByDigdeeper)
// Obtener todos los servicios con los dos ultimos comentarios de un proveedor
router.get("/servicesbydigdeepercomments/:id",servicesService.getServicesByDigdeeperComments)
// Eliminar un servicio
router.delete("/services:id",servicesService.deleteService)
// Exportar el módulo de rutas para API
module.exports = router