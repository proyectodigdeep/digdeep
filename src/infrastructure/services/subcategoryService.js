var express 	= require("express")
var subcategoryApp = require("../../application/subcategoryApp")

exports.createSubcategory= function(req,res){
 	var data = req.body
 	subcategoryApp.create(data, function(subcategory) {
		res.status(201)
		res.json({
			status: 	"success",
			message: 	"Subcategoria creada correctamente",
			subcategory: 	subcategory
		})
	}, function(err) {
		res.status(400)
		res.json({
			status: "failure",
			message: err
		})
	})
}

exports.getSubcategories = function(req, res) {
	subcategoryApp.getSubcategories(function(subcategories) {
		res.status(201)
		res.json({
			status: "success",
			subcategories: subcategories
		})
	}, function(err) {
		res.status(400)
		res.json({
			status: "failure",
			message: err
		})
	})
}

exports.getSubcategory = function(req, res) {
	var id = req.params.id
	subcategoryApp.getSubcategory(id,function(subcategory) {
		res.status(201)
		res.json({
			status: "success",
			subcategory:subcategory
		})
	}, function(err) {
		res.status(400)
		res.json({
			status: "failure",
			message: err
		})
	})
}

exports.updateSubcategory = function (req,res) {
	var id 	= req.params.id
	var data= req.body
	subcategoryApp.updateSubcategory(id, data, function(subcategory) {
		res.status(201)
		res.json({
			status: "success",
			message: "Subcategoria actualizada",
			subcategory:subcategory
		})
	}, function(err) {
		res.status(400)
		res.json({
			status: "failure",
			message: err
		})
	})
}

exports.deleteSubcategory = function(req, res) {
	var id = req.params.id
	subcategoryApp.deleteSubcategory(id, function() {
		res.status(201)
		res.json({
			status: "success",
			message: "Categoria eliminada : "+id
		})
	}, function(err) {
		res.status(400)
		res.json({
			status: "failure",
			message: err
		})
	})
}