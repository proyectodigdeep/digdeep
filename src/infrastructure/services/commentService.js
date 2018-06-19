var express 	= require("express")
var commentApp = require("../../application/commentApp")

exports.createComment= function(req,res){
 	var data = req.body
 	commentApp.create(data, function(comment) {
		res.status(201)
		res.json({
			status: 	"success",
			message: 	"Comentario creado correctamente",
			comment: 	comment
		})
	}, function(err) {
		res.status(400)
		res.json({
			status: "failure",
			message: err
		})
	})
}

exports.getComments = function(req, res) {
	commentApp.getComments(function(comments) {
		res.json({
			status: "success",
			comments: comments
		})
	}, function(err) {
		res.status(400)
		res.json({
			status: "failure",
			message: err
		})
	})
}

exports.getComment = function(req, res) {
	var id = req.params.id
	commentApp.getComment(id,function(comment) {
		res.json({
			status: "success",
			comment:comment
		})
	}, function(err) {
		res.status(400)
		res.json({
			status: "failure",
			message: err
		})
	})
}