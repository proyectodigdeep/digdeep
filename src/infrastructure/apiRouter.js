// Librerías externas
var express = require("express")
var router = express.Router()

//var apiService = require("./services/apiService") // apiService es muy generico, deberiamos pasar todas las funciones a servicios mas especificos
var userService = require("./services/userService") // Este es un servicio especifico para usuarios
var securityService = require("./services/securityService") // Este es un servicio especifico para iniciar sesión

// Crea nuevo usuario
//router.post("/users", userService.createUser)

// Iniciar sesión
//router.post("/authenticate", securityService.authenticate)
/*
router.get("/users/:id", apiService.getUser)
router.get("/users", apiService.getUsers)

router.post("/categories",apiService.createCategory)
router.get("/categories", apiService.getCategories)
router.get("/categories/:id",apiService.getCategory)
router.delete("/categories/:id",apiService.deleteCategory)
router.put("/categories/:id",apiService.updateCategory)

router.post("/services",apiService.createService)
router.get("/services",apiService.getServices)

router.post("/cities",apiService.createCity)
router.get("/cities/:id",apiService.getCity)
router.get("/cities",apiService.getCities)

router.post("/typeservices",apiService.createtypeService)
router.get("/typeservices/:id",apiService.gettypeService)
router.get("/typeservices",apiService.gettypeServices)
router.delete("/typeservices/:id",apiService.deleteTypeService)
router.put("/typeservices/:id",apiService.updateTypeService)

router.post("/questions",apiService.createQuestion)
router.get("/questions/:id",apiService.getQuestion)
router.get("/questions",apiService.getQuestions)
router.delete("/questions/:id",apiService.deleteQuestion)
router.put("/questions/:id",apiService.updateQuestion)

router.post("/answers",apiService.createAnswer)
router.get("/answers/:id",apiService.getAnswer)
router.get("/answers/",apiService.getAnswers)

router.post("/questionnaires",apiService.createQuestionnaire)
router.get("/questionnaires",apiService.getQuestionnaires)

router.post("/survey",apiService.saveSurvey)
*/
// Exportar el módulo de rutas para API
module.exports = router