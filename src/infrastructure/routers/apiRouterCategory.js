// Librerías externas
var express = require("express")
var router = express.Router()

var categoryService 	= require("../services/categoryService") // Este es un servicio especifico para categorias
var subcategoryService  = require("../services/subcategoryService") // Este es un servicio especifico para subcategorias

router.post("/categories", categoryService.createCategory)
router.get("/categories", categoryService.getCategories)
router.get("/categories/:id",categoryService.getCategory)
router.get("/categoriesbyslug/:id",categoryService.getCategoryBySlug)
router.put("/categories/:id",categoryService.updateCategory)
router.delete("/categories/:id",categoryService.deleteCategory)

router.post("/subcategories", subcategoryService.createSubcategory)
router.get("/subcategories", subcategoryService.getSubcategories)
router.get("/subcategories/:id",subcategoryService.getSubcategory)
router.put("/subcategories/:id",subcategoryService.updateSubcategory)
router.delete("/subcategories/:id",subcategoryService.deleteSubcategory)

// Exportar el módulo de rutas para API
module.exports = router