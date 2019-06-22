// Dependencias
var express			= require('express')
var userService 	= require('../services/userService')		// Este es un servicio especifico para los usuarios
var orderService 	= require('../services/orderService')		// Este es un servicio especifico para las ordenes de los usuarios
var servicesService = require("../services/servicesService") 	// Este es un servicio especifico para servicios
var calendarService = require("../services/calendarService") 	// Este es un servicio especifico para calendario

module.exports = function() {

	var router = new express.Router()

	// RUTAS
	
	//[ok] Desbloquear un proveedor de la pagína web
	router.get('/validateproviders/:id', function(req, res, next) {
		if (req.user.hasRole('root')){
			userService.validateProvider(req, res, next)
		}
		else {
			res.status(403)
			res.json("No tienes el rol necesario para esta solicitud")
		}
	})
	
	//[ok] Bloquear un proveedor de la pagína web
	router.get('/disvalidateproviders/:id', function(req, res, next) {
		if (req.user.hasRole('root')){
			userService.disvalidateProvider(req, res, next)
		}
		else {
			res.status(403)
			res.json("No tienes el rol necesario para esta solicitud")
		}
	})

	//[ok] Obtener todos los proveedores registrados
	router.get('/providers/:id', function(req, res, next) {
		if (req.user.hasRole('root')){
			userService.getProviders(req.params.id, res, next)
		}
		else{
			res.status(403)
			res.json("No tienes el rol necesario para esta solicitud")
		} 
	})
	
	//[ok digdeeper, falta probar el de usuario normal] Actualizar datos de un usuario
	router.put('/users/:id', function(req, res, next) {
		if (req.user.hasRole('user') || req.user.hasRole('root')){
			if (req.body.temp_service === null || req.body.temp_service === undefined ) {
				//console.log("solo quiero actualizar mis datos ")
				userService.updateUser(req, res, next)
			}else{
				//console.log("me quiero actualizar a digdeeper")
				userService.updateUserToDigdeeper(req, res, next)
			}	
		}
		else{
			if (req.user.hasRole('digdeeper')){
				//console.log("Solo quiero actualizar mis datos digdeeper")
				userService.updateUserDDiper(req, res, next)
			}
			else{
				res.status(403)
				res.json("No tienes el rol necesario para esta solicitud")
			}
		}
	})

	// Actualizar el password de un usuario
	router.put('/userspassword/:id', function(req, res, next) {
		if (req.user.hasRole('user')){
			userService.updatePasswordUser(req, res, next)
		}
		else {
			if (req.user.hasRole('digdeeper')){
				userService.updatePasswordUser(req, res, next)
			}
			else{
				if (req.user.hasRole('root')){
					userService.updatePasswordUser(req, res, next)
				}else{
					res.status(403)
					res.json("No tienes el rol necesario para esta solicitud")
				}
			}
		}
	})

	// Agregar un servicio a un usuario digdeeper
	router.put('/usersaddservice/:id', function(req, res, next) {
		if (req.user.hasRole('user')){
			userService.updateUserDDiper(req, res, next)
		}
		else {
			if (req.user.hasRole('digdeeper')){
				userService.updateUserDDiper(req, res, next)
			}
			else{
				res.status(403)
				res.json("No tienes el rol necesario para esta solicitud")
			}
		}
	})

	// Agregar una orden a un usuario "user o cliente"
	router.put('/useraddorder/:id', function(req, res, next) {
		if (req.user.hasRole('user')){
			userService.updateUser(req, res, next)
		}
		else {
			res.status(403)
			res.json("No tienes el rol necesario para esta solicitud")
		}
	})

	//[ok] Agregar una tarjeta a un cliente
	router.post("/addmethodpay/:id", function (req, res, next) {
		// Verificar si la petición la hace un usuario de la app
		if (req.user.hasRole('user') || req.user.hasRole('digdeeper')) {
			userService.addMethodPayToCustomer(req,res,next)
		}else{
			res.status(403)
			res.json("No tienes el rol necesario para esta solicitud")
		}
	})

	// Crear un evento de un proveedor
	router.post('/events', function(req, res, next) {
		if (req.user.hasRole('digdeeper')){
			calendarService.createEvent(req, res, next)
		}
		else {
			res.status(403)
			res.json("No tienes el rol necesario para esta solicitud")
		}
	})

	// Obtener todos los eventos
	router.get('/events', function(req, res, next) {
		if (req.user.hasRole('digdeeper')){
			calendarService.getEvents(req, res, next)
		}
		else {
			res.status(403)
			res.json("No tienes el rol necesario para esta solicitud")
		}
	})

	// Obtener un evento
	router.get('/events/:id', function(req, res, next) {
		if (req.user.hasRole('digdeeper')){
			calendarService.getEvent(req, res, next)
		}
		else {
			res.status(403)
			res.json("No tienes el rol necesario para esta solicitud")
		}
	})

	// actualizar un evento de un proveedor
	router.put('/events/:id', function(req, res, next) {
		if (req.user.hasRole('digdeeper')){
			calendarService.updateEvent(req, res, next)
		}
		else {
			res.status(403)
			res.json("No tienes el rol necesario para esta solicitud")
		}
	})

	// eliminar un evento de un digdeeper
	router.delete('/events/:id', function(req, res, next) {
		if (req.user.hasRole('digdeeper')){
			calendarService.deleteEvent(req, res, next)
		}
		else {
			res.status(403)
			res.json("No tienes el rol necesario para esta solicitud")
		}
	})

	// Obtener el metodo de pago de un usuario si es que ya esta registrado como customer en conekta
	router.get("/verifyMethodPay/:id", function (req, res, next) {
		// Verificar si la petición la hace un usuario de la app
		if (req.user.hasRole('digdeeper') || req.user.hasRole('user')) {
			userService.verifyMethodPay(req,res,next)
		}else{
			res.status(403)
			res.json("No tienes el rol necesario para esta solicitud")
		}
	})

	//[ok] Crea una nueva solicitud de orden, de un usuario con rol "user"
	router.post('/orders',orderService.postOrder)
	// Obtener una orden en especifico
	router.get('/orders/:id',orderService.getOrder)
	
	//[OK] Obtener todas las ordenes
	router.get('/orders',orderService.getOrders)
	//[OK] Obtener todas las ordenes pendientes
	router.get('/orderstest',orderService.getOrdersTest)
	router.get('/orderspending',orderService.getOrdersTest)
	//[OK] Obtener todas las ordenes en proceso
	router.get('/ordersinprocess',orderService.getOrdersInprocess)
	//[OK] Obtener todas las ordenes finalizadas
	router.get('/ordersfinished',orderService.getOrdersFinished)
	//[OK] Obtener todas las ordenes canceladas
	router.get('/orderscanceled',orderService.getOrdersCanceled)
	//[OK] Obtener todas las ordenes pagadas
	router.get('/orderspay',orderService.getOrdersPay)

	//[ok] Obtener todas las ordenes de un cliente
	router.get('/ordersbyclient/:id',orderService.getOrdersByClient)
	//[ok] Obtener todas las ordenes de un digdeeper
	router.get('/ordersbydigdeeper/:id',orderService.getOrdersByDigdeeper)
	//[OK] Obtener todas las ordenes que ha echo un usuario con rol "user"
	router.get('/ordersofuser/:id',orderService.getOrdersOfUser)
	
	//[OK] Confirmar una orden que tiene un usuario digdeeper
	router.post('/confirmorders',orderService.confirmOrder)
	//[OK]Cancelar una orden
	router.post('/cancelorders',orderService.cancelOrder)
	//[ok]Finalizar una orden que tiene un usuario digdeeper
	router.post('/finishorders',orderService.finishOrder)
	// Pagar una orden
	router.post('/payorders',orderService.payOrder)
	// Calificar una orden
	router.post('/qualifyservice',orderService.qualifyService)
	
	// Obtener los datos de un proveedor para mostrarselos a un usuario "user"
	router.post('/ddtoservice',userService.getDataUserToService)
	// Actualizar un servicio
	router.put("/services/:id",servicesService.updateService)
	// Añadir un comentario al servicio
	router.put("/addcommentservice/:id",servicesService.addComment)
	
	return router
}