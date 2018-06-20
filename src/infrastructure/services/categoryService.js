var express 	= require("express")
var categoryApp = require("../../application/categoryApp")

exports.createCategory= function(req,res){
 	var data = req.body
 	categoryApp.create(data, function(category) {
		res.status(201)
		res.json({
			status: 	"success",
			message: 	"Categoria creada correctamente",
			category: 	category
		})
	}, function(err) {
		res.status(400)
		res.json({
			status: "failure",
			message: err
		})
	})
}

exports.getCategories = function(req, res) {
	categoryApp.getCategories(function(categories) {
		res.json({
			status: "success",
			categories: categories
		})
	}, function(err) {
		res.status(400)
		res.json({
			status: "failure",
			message: err
		})
	})
}

exports.getCategory = function(req, res) {
	var id = req.params.id
	categoryApp.getCategory(id,function(category) {
		res.json({
			status: "success",
			category:category
		})
	}, function(err) {
		res.status(400)
		res.json({
			status: "failure",
			message: err
		})
	})
}
exports.getCategoryBySlug = function(req, res) {
	var id = req.params.id
	categoryApp.getCategoryBySlug(id,function(category) {
		res.json({
			status: "success",
			category:category
		})
	}, function(err) {
		res.status(400)
		res.json({
			status: "failure",
			message: err
		})
	})
}

exports.updateCategory = function (req,res) {
	var id 	= req.params.id
	var data= req.body
	categoryApp.updateCategory(id, data, function(category) {
		res.json({
			status: "success",
			message: "Categoria actualizada",
			category:category
		})
	}, function(err) {
		res.status(400)
		res.json({
			status: "failure",
			message: err
		})
	})
}

exports.deleteCategory = function(req, res) {
	var id = req.params.id
	categoryApp.deleteCategory(id, function() {
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