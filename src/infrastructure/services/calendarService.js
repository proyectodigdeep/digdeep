var express 	= require("express")
var calendarApp = require("../../application/calendarApp")

exports.createEvent= function(req,res){
 	var data = req.body
 	//console.log(data)
 	calendarApp.create(data, function(event) {
		res.status(201)
		res.json({
			status: "success",
			message: "evento creado correctamente",
			event: event
		})
	}, function(err) {
		res.status(400)
		res.json({
			status: "failure",
			message: err
		})
	})
}

exports.getEvents = function(req, res) {
	calendarApp.getEvents(function(events) {
		//console.log(events)
		res.json({
			status: "success",
			events: events
		})
	}, function(err) {
		res.status(400)
		res.json({
			status: "failure",
			message: err
		})
	})
}
exports.getEventsByDigdeeper = function(req, res) {
	id = req.params.id
	calendarApp.getEventsByDigdeeper(id, function(events) {
		//console.log(events)
		res.status(201)
		res.json({
			status: "success",
			events: events
		})
	}, function(err) {
		res.status(400)
		res.json({
			status: "failure",
			message: err
		})
	})
}

exports.getEvent = function(req, res) {
	var id = req.params.id
	calendarApp.getEvent(id, function(event) {
		res.json({
			status: "success",
			event:event
		})
	}, function(err) {
		res.status(400)
		res.json({
			status: "failure",
			message: err
		})
	})
}

exports.updateEvent = function (req,res) {
	var id 	= req.params.id
	var data= req.body
	calendarApp.updateEvent(id, data, function(event) {
		res.json({
			status: "success",
			message: "Evento actualizado",
			event: event
		})
	}, function(err) {
		res.status(400)
		res.json({
			status: "failure",
			message: err
		})
	})
}

exports.deleteEvent = function(req, res) {
	var id = req.params.id
	calendarApp.deleteEvent(id, function() {
		res.json({
			status: "success",
			message: "Evento eliminado: "+id
		})
	}, function(err) {
		res.status(400)
		res.json({
			status: "failure",
			message: err
		})
	})
}