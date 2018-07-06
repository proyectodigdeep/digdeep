var orderApp 	= require('../../application/orderApp')
var userApp 	= require('../../application/userApp')
var serviceApp = require('../../application/serviceApp')
var conektaService 	= require('./conektaService')
var emailService = require('./emailService');
var async = require('async');

exports.postOrder = function(req, res) {
	if (req.user.hasRole('user')){
		var data = req.body
		orderApp.create(data, function(order) {
			res.status(201)
			res.json({
				status: "success",
				message: "orden creada correctamente",
				order: order
			})
		}, function(err) {
			res.status(400)
			res.json({
				status: "failure",
				message: err
			})
		})
	}
	else {
		res.status(403)
		res.json({
			message: "No tienes el rol necesario para esta solicitud"
		})
	}
}
exports.confirmOrder = function(req, res) {
	if (req.user.hasRole('digdeeper')){
		id_order = req.body.id_order
		data = {
			startDateService: req.body.startDateService
		}
		orderApp.confirmOrder(id_order,data,function(order) {
			res.status(201)
			res.json({
				status: "success",
				message: "orden confirmada correctamente",
				order: order
			})
		}, function(err) {
			res.status(400)
			res.json({
				status: "failure",
				message: err
			})
		})
	}
	else {
		res.status(403)
		res.json({
			message: "No tienes el rol necesario para esta solicitud"
		})
	}
}
exports.cancelOrder = function(req, res) {
	if (req.user.hasRole('digdeeper') || req.user.hasRole('user')){
		id_order = req.body.id_order
		data = {
			id_order : req.body.id_order,
            id_user  : req.body.id_user,
            cancelReasons: req.body.cancelReasons,
            endDateOrder: req.body.endDateOrder
		}
		orderApp.cancelOrder(id_order,data,function(order) {
			res.status(201)
			res.json({
				status: "success",
				message: "orden cancelada correctamente",
				order: order
			})
		}, function(err) {
			res.status(400)
			res.json({
				status: "failure",
				message: err
			})
		})
	}
	else {
		res.status(403)
		res.json({
			message: "No tienes el rol necesario para esta solicitud"
		})
	}
}
exports.finishOrder = function(req, res) {
	if (req.user.hasRole('digdeeper')){
		id_order = req.body.id_order
		data = {
			endDateService: req.body.endDateService
		}
		orderApp.finishOrder(id_order,data,function(order) {
			res.status(201)
			res.json({
				status: "success",
				message: "orden finalizada correctamente",
				order: order
			})
		}, function(err) {
			res.status(400)
			res.json({
				status: "failure",
				message: err
			})
		})
	}
	else {
		res.status(403)
		res.json({
			message: "No tienes el rol necesario para esta solicitud"
		})
	}
}
exports.payOrder = function(req, res) {
	if (req.user.hasRole('user')){
		var id_order = req.body.id_order;
		var tokenCard = req.body.tokenCard;
		var paymentMethod = req.body.paymentMethod;
		var data = {
			payDateService: req.body.payDateService,
			idOrderConekta: null,
			paymentMethod: "-"
		}

		// if invalid type method
		if (!paymentMethod || (paymentMethod !== 'card' && paymentMethod !== 'spei')) {
			return res.status(400).json({
				status: "failure",
				message: 'bad request'
			});
		}

		async.waterfall([
			// get full order
			function (callback) {
				orderApp.getOrder(id_order, function (fullOrder) {					
					callback(null, {
						client: fullOrder.client,
						name: fullOrder.dataService.title,
						price: fullOrder.dataService.cost
					});
				}, function (err) {
					callback({errName: 'error to get order', err: err});
				});
			},
			// get user
			function (order, callback) {
				userApp.getUser(order.client, function (fullClient) {
					callback(null, order, fullClient);
				}, function (err) {
					callback({ errName: 'error to get user', err: err });
				});
			},
			// create a customer conekta
			function (order, client, callback) {
				const customer = {
					name: client.fullname,
					email: client.email,
					phone: client.phone
				};

				if (paymentMethod === 'card') {
					
					// if client contain customerId this is returned
					if (client.customerId && client.customerId !== '') {
						client.id_paymentSource = tokenCard				
						return callback(null, order, client);
					}
					// if not contain customer then create a customer on conekta
					conektaService.createCustomer(customer, tokenCard, function (customer) {
						// add customer id to client					
						client.customerId = customer.id;						
						// update client with customer id
						userApp.update(client._id, client, function (resClient) {
							//callback(null, order, { customerId: client.customerId});
							callback(null, order, customer);
						}, function (err) {
							callback({ errName: 'error to update user', err: err });
						});
					}, function (err) {
						callback({ errName: 'error to create customer', err: err });
					});
				}else {					
					// SPEI
					console.log(order, customer)
					callback(null, order, customer);
				}
			},
			// create order in conekta
			function (order, customer, callback) {
				/*v1
				conektaService.createOrder(order, customer, paymentMethod, tokenCard, function (_order) {
					callback(null, _order);
				}, function (err) {
					callback({ errName: 'error to create order', err: err });					
				});*/
				if (customer.default_payment_source_id) {
					var id_paymentSource = customer.default_payment_source_id
					customer.customerId = customer.id
					conektaService.createOrder(order, customer, paymentMethod, id_paymentSource, function (_order) {
						callback(null, _order);
					}, function (err) {
						callback({ errName: 'error to create order', err: err });					
					});	
				}else{
					if (customer.id_paymentSource) {
						var id_paymentSource = customer.id_paymentSource
						conektaService.createOrder(order, customer, paymentMethod, id_paymentSource, function (_order) {
							callback(null, _order);
						}, function (err) {
							callback({ errName: 'error to create order', err: err });					
						});	
					}else{
						// Orden SPEI
						console.log(paymentMethod)
						conektaService.createOrder(order, customer, paymentMethod, id_paymentSource, function (_order) {
							callback(null, _order);
						}, function (err) {
							callback({ errName: 'error to create order', err: err });					
						});	
					}
					
				}
				
			}
		], 
		// err : Error en algun paso anterior de las funciones de serie
		// order: contiene la informacion de la orden creada en conekta
		function (err, order) {
			
			
			if (err) {
				console.error('err: ', err);
				var message = err
				if (err.err.details) {
					message = err.err.details[0].message
				}
				return res.status(400).json({
					status: "failure",
					message: message
				});
			}
			console.log('order: ', order );
					
			// Para el pago vía tarjeta o spei el estatus de pago siempre sera pendiente
			// guardar el id de orden de conekta en la orden para 
			// la posterior validacion del pago por medio del webhook
			// la orden debe tener un estatus de pago pendiente
			var idOrdenConekta = order.id;
			data.idOrderConekta = idOrdenConekta

			// si el pago fue por tarjeta
			if (paymentMethod === 'card') {
				data.paymentMethod = "Tarjeta"
				orderApp.payOrder(id_order,data, function(orderUpdated) {
					res.status(201).json({
						status: "success",
						message: "orden generada correctamente por tarjeta",
						order: orderUpdated
					});
				}, function(err) {
					res.status(400).json({
						status: "failure",
						message: err
					});
				})
			}else {
				data.paymentMethod = "Spei"
				console.log("generando orden spei")
				// se envia mail de notificacion con la informacion SPEI
				emailService.notificacionDatosSPEI(
					{
						fullname: order.customer_info.name,
						phone: order.customer_info.phone,
						email: order.customer_info.email						
					},
					{
						id: order.id,
						bank: order.charges.data[0].payment_method.receiving_account_bank,
						clabe: order.charges.data[0].payment_method.receiving_account_number,
						monto: (order.amount/100)
					}, function (resultMail) {
						console.log('resultMail: ', resultMail);
					}
				)
				orderApp.payOrder(id_order,data, function(orderUpdated) {
					res.status(201).json({
						status: "success",
						message: "orden generada correctamente por SPEI",
						order: orderUpdated
					});
				}, function(err) {
					res.status(400).json({
						status: "failure",
						message: err
					});
				})
			}			
		});

	}
	else {
		res.status(403).json({
			message: "No tienes el rol necesario para esta solicitud"
		})
	}
}
exports.qualifyService = function(req, res) {
	if (req.user.hasRole('user')){
		data = {
			id_order: req.body.id_order,
			value: req.body.value
		}
		orderApp.qualifyOrder(data, function(order) {
			serviceApp.getService(order.dataService._service, function (service) {
				var servicesTemp = service.values
				servicesTemp.push(order.value)
				dataservice = {
					values: servicesTemp
				}
				serviceApp.updateService(order.dataService._service, dataservice, function (ser) {
					serviceApp.getServicesByDigdeeper(order.digdeeper,function (services) {
						var calf 		= 0
						var valuesUser	= []
						for (var i = 0; i < services.length; i++) {
							for (var j = 0; j < services[i].values.length; j++) {
								valuesUser.push(services[i].values[j])
								calf = calf + services[i].values[j]
							}
						}
						calf = calf / valuesUser.length
						var data = {
							calf: calf,
							values: valuesUser
						}
						userApp.update(order.digdeeper,data,function (user) {
							res.status(201)
							res.json({
								status: "success",
								message: "orden  y servicio calificados correctamente",
								order: order,
								srevice: ser,
								digdeeper: user
							})
						},function (err) {
							res.status(400)
							res.json({
								status: "failure",
								message: err
							})
						})
					},function (err) {
						res.status(400)
						res.json({
							status: "failure",
							message: err
						})
					})
				},function (err) {
					res.status(400)
					res.json({
						status: "failure",
						message: err
					})
				})
			},function (err) {
				res.status(400)
				res.json({
					status: "failure",
					message: err
				})
			})			
		}, function(err) {
			res.status(400)
			res.json({
				status: "failure",
				message: err
			})
		})
	}
	else {
		res.status(403)
		res.json({
			message: "No tienes el rol necesario para esta solicitud"
		})
	}
}
exports.getOrders = function(req, res) {
	if (req.user.hasRole('digdeeper') || req.user.hasRole('root')){
		orderApp.getOrders(function(orders) {
			res.status(201)
			res.json({
				status: "success",
				message: "ordenes obtenidas correctamente",
				orders: orders
			})
		}, function(err) {
			res.status(400)
			res.json({
				status: "failure",
				message: err
			})
		})
	}
	else {
		res.status(403)
		res.json({
			message: "No tienes el rol necesario para esta solicitud"
		})
	}
}
// Obtener ordenes sin permiso
exports.verifyOrderConekta = function(req, res) {
	orderApp.getOrderByIdConkta(req.params.id,function(order) {
		res.status(201)
		res.json({
			status: "success",
			message: "orden obtenida correctamente",
			order: order
		})
	}, function(err) {
		res.status(400)
		res.json({
			status: "failure",
			message: err
		})
	})
}
// ordenes pendientes
exports.getOrdersPending = function(req, res) {
	if (req.user.hasRole('digdeeper') || req.user.hasRole('root')){
		orderApp.getOrdersPending(function(orders) {
			res.status(201)
			res.json({
				status: "success",
				message: "ordenes obtenidas correctamente",
				orders: orders
			})
		}, function(err) {
			res.status(400)
			res.json({
				status: "failure",
				message: err
			})
		})
	}
	else {
		res.status(403)
		res.json({
			message: "No tienes el rol necesario para esta solicitud"
		})
	}
}
// ordenes en proceso
exports.getOrdersInprocess = function(req, res) {
	if (req.user.hasRole('digdeeper') || req.user.hasRole('root')){
		orderApp.getOrdersInprocess(function(orders) {
			res.status(201)
			res.json({
				status: "success",
				message: "ordenes obtenidas correctamente",
				orders: orders
			})
		}, function(err) {
			res.status(400)
			res.json({
				status: "failure",
				message: err
			})
		})
	}
	else {
		res.status(403)
		res.json({
			message: "No tienes el rol necesario para esta solicitud"
		})
	}
}
// obtener ordenes finalizadas
exports.getOrdersFinished = function(req, res) {
	if (req.user.hasRole('digdeeper') || req.user.hasRole('root')){
		orderApp.getOrdersFinished(function(orders) {
			res.status(201)
			res.json({
				status: "success",
				message: "ordenes obtenidas correctamente",
				orders: orders
			})
		}, function(err) {
			res.status(400)
			res.json({
				status: "failure",
				message: err
			})
		})
	}
	else {
		res.status(403)
		res.json({
			message: "No tienes el rol necesario para esta solicitud"
		})
	}
}
// obtener las ordenes canceladas
exports.getOrdersCanceled = function(req, res) {
	if (req.user.hasRole('digdeeper') || req.user.hasRole('root')){
		orderApp.getOrdersCanceled(function(orders) {
			res.status(201)
			res.json({
				status: "success",
				message: "ordenes obtenidas correctamente",
				orders: orders
			})
		}, function(err) {
			res.status(400)
			res.json({
				status: "failure",
				message: err
			})
		})
	}
	else {
		res.status(403)
		res.json({
			message: "No tienes el rol necesario para esta solicitud"
		})
	}
}
// obtener las ordenes pagadas
exports.getOrdersPay = function(req, res) {
	if (req.user.hasRole('digdeeper') || req.user.hasRole('root')){
		orderApp.getOrdersPay(function(orders) {
			res.status(201)
			res.json({
				status: "success",
				message: "ordenes obtenidas correctamente",
				orders: orders
			})
		}, function(err) {
			res.status(400)
			res.json({
				status: "failure",
				message: err
			})
		})
	}
	else {
		res.status(403)
		res.json({
			message: "No tienes el rol necesario para esta solicitud"
		})
	}
}

exports.getOrder = function(req, res) {
	if (req.user.hasRole('root') || req.user.hasRole('digdeeper')){
		orderApp.getOrder(req.params.id,function(order) {
			res.status(201)
			res.json({
				status: "success",
				message: "orden obtenida correctamente",
				order: order
			})
		}, function(err) {
			res.status(400)
			res.json({
				status: "failure",
				message: err
			})
		})
	}
	else {
		res.status(403)
		res.json({
			message: "No tienes el rol necesario para esta solicitud"
		})
	}
}

// Obtener todas las ordenes de un usuario con rol "user"
exports.getOrdersByClient = function(req, res) {
	if (req.user.hasRole('user')){
		orderApp.getOrdersByClient(req.params.id, function(orders) {
			res.status(201)
			res.json({
				status: "success",
				message: "ordenes obtenidas correctamente",
				orders: orders
			})
		}, function(err) {
			res.status(400)
			res.json({
				status: "failure",
				message: err
			})
		})
	}
	else {
		res.status(403)
		res.json({
			message: "No tienes el rol necesario para esta solicitud"
		})
	}
}
// Obtener todas las ordenes de un usuario con rol "digdeeper"
exports.getOrdersByDigdeeper = function(req, res) {
	if (req.user.hasRole('digdeeper')){
		orderApp.getOrdersByDigdeeper(req.params.id, function(orders) {
			res.status(201)
			res.json({
				status: "success",
				message: "ordenes obtenidas correctamente",
				orders: orders
			})
		}, function(err) {
			res.status(400)
			res.json({
				status: "failure",
				message: err
			})
		})
	}
	else {
		res.status(403)
		res.json({
			message: "No tienes el rol necesario para esta solicitud"
		})
	}
}

// Obtener todas las fechas de un proveedor
exports.getDatesByDigdeeper = function(req, res) {
	var dates = []
	var ordersDates = []
	orderApp.getOrdersByDigdeeper(req.params.id, function(orders) {
		for (var i = 0; i < orders.length; i++) {
			var orderdate = {
				dateInit: orders[i].dataService.dateInit,
				dateFinish: orders[i].dataService.dateFinish,
				hourInit: orders[i].dataService.hourInit,
				hourFinish: orders[i].dataService.hourFinish
			}
			ordersDates.push(orderdate)
			dates.push(orders[i].dataService.dateInit)
			dates.push(orders[i].dataService.dateFinish)	
		}
		res.status(201)
		res.json({
			status: "success",
			message: "Fechas obtenidas correctamente",
			dates: dates,
			ordersDates: ordersDates
		})
	}, function(err) {
		res.status(400)
		res.json({
			status: "failure",
			message: "No se ha´podido obtener las fechas."
		})
	})
}


// Obtener todos los horarios no disponibles de un proveedor(digdeeper), segun una fecha especifica
exports.getForRangeDateByDigdeeper = function(req, res) {
	var id_user = req.params.id
	var dateDefaultInit = req.body.dateDefaultInit
	var dateDefaultFinish = req.body.dateDefaultFinish

	orderApp.getForRangeDateByDigdeeper(id_user, dateDefaultInit, dateDefaultFinish, function(orders) {
		console.log(orders)
		// Obtener los horarios
		var ordersDates = []
		for (var i = 0; i < orders.length; i++) {
			var orderdate = {
				dateInit: orders[i].dataService.dateInit,
				dateFinish: orders[i].dataService.dateFinish,
				hourInit: orders[i].dataService.hourInit,
				hourFinish: orders[i].dataService.hourFinish
			}
			ordersDates.push(orderdate)
		}
		res.status(201)
		res.json({
			status: "success",
			message: "Fechas obtenidas correctamente",
			//dates: dates,
			orders: ordersDates
		})
	}, function(err) {
		res.status(400)
		res.json({
			status: "failure",
			message: "No se ha´podido obtener las fechas."
		})
	})
}

// Obtener todas las ordenes de un usuario con rol "user"
exports.getOrdersOfUser = function (req, res) {
	if (req.user.hasRole('user')){
		var id 			= req.params.id
		var ordersIds	= []
		var orderTemp   = {
			dataOrder: 	null,
			dataService: null  
		}
		userApp.getUser(id, function (user) {
			var ordersArray = []
			ordersIds = user.myServicesRequested
			if (ordersIds.length === 0 || ordersIds === null || ordersIds === undefined) {
				res.json({
					status: "success",
					orders: ordersArray
				})
			}else{
				orderApp.getOrders(function (orders) {
					for (var i = 0; i < orders.length; i++) {
						for (var j = 0; j < ordersIds.length; j++) {
							if (String(orders[i]._id) === String(ordersIds[j])) {
								orderTemp.dataOrder  = orders[i]
								ordersArray.push(orderTemp.dataOrder)
								if (ordersArray.length === ordersIds.length) {
									//console.log(ordersArray)
									res.status(201)
									res.json({
										status: "success",
										orders: ordersArray
									})
								}
							}
						}
					}
				},function (err) {
					res.status(403)
					res.json({
						status: "failure",
						message: err
					})
				})
			}
		},function (err) {
			res.status(400)
			res.json({
				status: "failure",
				message: err
			})
		})
	}
	else {
		res.status(403)
		res.json({
			message: "No tienes el rol necesario para esta solicitud"
		})
	}
}