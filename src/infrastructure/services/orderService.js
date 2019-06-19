var orderApp 	= require('../../application/orderApp')
var userApp 	= require('../../application/userApp')
var serviceApp = require('../../application/serviceApp')
var calendarApp = require('../../application/calendarApp')
var conektaService 	= require('./conektaService')
var emailService = require('./emailService');
var async = require('async');

/*emailService.notification_contact(
	{
		fullname: "Jose Luis",
		phone: "213123",
		email: "j.lpumas@hotmail.com"		
	},
	{
		title: "hola servicio de prueba",
		cost: "232"
	}, function (resultMail) {
		console.log('resultMail: ', resultMail);
	}
)*/
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
		orderApp.finishOrder(id_order,data, function(order_finished) {
			////
				var id_order = order_finished._id
				var paymentMethod = 'card'
				/////PAGAR ORDEN
				async.waterfall([
					// get full order
					function (callback) {
						
						orderApp.getOrder(id_order, function (fullOrder) {					
							callback(null, {
								client: fullOrder.client,
								name: fullOrder.dataService.title,
								price: fullOrder.dataService.cost,
								id_paymentSource: fullOrder.idMethodPay
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
								//client.id_paymentSource = tokenCard
								conektaService.searchCustomer(client.customerId, function (customer) {
									client.id_paymentSource = order.id_paymentSource
									/*if (customer.payment_sources.data.length > 0) {
										client.id_paymentSource = customer.payment_sources.data[0].id
									}*/
									return callback(null, order, client);
								}, function (err) {
									return callback(null, order, client);
								})
								
							}else{
								// if not contain customer then create a customer on conekta
								callback(null, order, customer);
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
							}
						}else {					
							// SPEI
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
									//console.log(_order.err.err)
									//console.log(_order.err.details)
									callback(null, _order);
								}, function (err) {
									//console.log(err.err.details)
									callback({ errName: 'error to create order', err: err });					
								});	
							}else{

								// Orden SPEI
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
						//onSuccess(order_finished)
						res.status(201)
						res.json({
							status: "success",
							message: "orden finalizada correctamente",
							order: order_finished
						})
						console.error('err: ', err);
						/*var message = err
						if (err.err.details) {
							message = err.err.details[0].message
						}
						return res.status(400).json({
							status: "failure",
							message: message
						});*/
					}
							
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
							//onSuccess(orderUpdated)
							/*res.status(201).json({
								status: "success",
								message: "orden generada correctamente por tarjeta",
								order: orderUpdated
							});*/
							res.status(201)
							res.json({
								status: "success",
								message: "orden finalizada correctamente",
								order: orderUpdated
							})
						}, function(err) {
							//onError(err)
							//onSuccess(order)
							/*res.status(400).json({
								status: "failure",
								message: err
							});*/
							res.status(201)
							res.json({
								status: "success",
								message: "orden finalizada correctamente",
								order: order_finished
							})
						})
					}else {
						data.paymentMethod = "Spei"
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
							//onSuccess(orderUpdated)
							/*res.status(201).json({
								status: "success",
								message: "orden generada correctamente por SPEI",
								order: orderUpdated
							});*/
							res.status(201)
							res.json({
								status: "success",
								message: "orden finalizada correctamente",
								order: orderUpdated
							})
						}, function(err) {
							//onSuccess(order)
							/*onError(err)*/
							/*res.status(400).json({
								status: "failure",
								message: err
							});*/
							res.status(201)
							res.json({
								status: "success",
								message: "orden finalizada correctamente",
								order: order_finished
							})
						})
					}			
				});
				/////
			////
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
			//console.log('order: ', order );
					
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
				//console.log("generando orden spei")
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

exports.whConekta = function (req, res) {
	var data = typeof req.body == 'string' ? JSON.parse(req.body.data) : req.body.data;
	
	// si existe una orden de conekta en el body request
	if (data && data.object && data.object.order_id) {
		var idOrdenConekta = data.object.order_id;
		var estatusOrden = data.object.status;// paid

		// Se busca la orden de conekta en la bd	
		orderApp.getOrderByIdConkta(String(idOrdenConekta), function(order){
			if(order){
				// Checa si el estatus de la orden esta en proceso de pago(6),
				// y que no este ya pagada(5), para evitar reenviar el correo.
				if (order.status === 6) {
					// Obtiene los datos del cliente
					userApp.getUser(order.client, function (user) {
						if (user) {
							// si la orden existe en la bd y
							// si el estatus de la orden es paid
							if (estatusOrden === 'paid') {
								// Se pone la orden en estatus pagada(5)
								orderApp.putStatusOrderPaid(order._id,function (order) {
								},function (err) {
									res.send("error");
								})
								// se envia notificacion de email de servicio pagado
								// hardcode datos de email, estos datos deben construirse en base a la orden en base de datos 
								var clientData = {
									fullname: user.fullname,
									phone: user.phone,
									email: user.email
								}
								//
									var dateFormated = new Date(order.dataService.dateInit)
									d = dateFormated.getDate();
									m = dateFormated.getMonth();
									y = dateFormated.getFullYear();
									monthString = getMonth(m)
									dateInit = String(d)+"/"+monthString+"/"+String(y)

									dateFormated = new Date(order.dataService.dateFinish)
									d = dateFormated.getDate();
									m = dateFormated.getMonth();
									y = dateFormated.getFullYear();
									monthString = getMonth(m)
									var dateFinish = String(d)+"/"+monthString+"/"+String(y)

									dateFormated = new Date(order.dataService.hourInit)
									var hh = dateFormated.getHours();
									var mm = dateFormated.getMinutes();
									var hourInit = String(hh)+":"+String(mm)

									dateFormated = new Date(order.dataService.hourFinish)
									hh = dateFormated.getHours();
									mm = dateFormated.getMinutes();
									var hourFinish = String(hh)+":"+String(mm)
								//
								var orderData = {
									title: order.dataService.title,
									cost: order.dataService.cost,
									dateInit: dateInit,
									dateFinish: dateFinish,
									hourInit: hourInit,
									hourFinish: hourFinish,
									picture: order.dataService.picture,
									digdeeper_name: order.dataService.nameDD,
									digdeeper_picture: order.dataService.imgDD
								}
								res.status(200);
								/*emailService.notificacionServicioPagado(clientData, orderData, function (result) {
									res.status(result.status).json(result.body);
								})*/
							}else {
								res.status(400);
							}
						}
					},function (err) {
						res.status(400);
					})
				}
			}else{
				res.status(400);
			}
		},function(err){
			console.log(err)
			res.status(400);
		})
	}else {
		res.status(400);
	}
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
/*exports.getDatesByDigdeeper = function(req, res) {
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
}*/

function reloadHours(hinit,hfinish,arrayHoursDefault, date_temp) {
	console.log(hinit)
	console.log(hfinish)
	var hourTemp_init = new Date(hinit)
    var hourTemp_finish = new Date(hfinish)

    var timeTemp = {
        init: date_temp.toISOString(date_temp.setHours(hourTemp_init.getHours(), hourTemp_init.getMinutes(), 0)),
        finish: date_temp.toISOString(date_temp.setHours(hourTemp_finish.getHours(), hourTemp_finish.getMinutes(), 0))
    }
    var arrayClean = []
    for (var i = 0; i < arrayHoursDefault.length; i++) {
        if(arrayHoursDefault[i] >= timeTemp.init && arrayHoursDefault[i] <= timeTemp.finish){
            arrayClean.push(arrayHoursDefault[i])
        }
    }
    //arrayHoursDefault = arrayClean
    return arrayClean
}
exports.getDatesByDigdeeper = function(req, res) {
	var dates = []
	var id_user = req.params.id
	var fecha_inicial_digdeeper = new Date()
	var fecha_final_digdeeper = new Date()
	var fechas_result = []
	userApp.getUser(id_user, function (user) {
		if (user.service_time && user.service_time.init != undefined && user.service_time.init != null) {
			fecha_inicial_digdeeper = user.service_time.init
			fecha_final_digdeeper = user.service_time.finish
		}else{
			fecha_inicial_digdeeper = null
			fecha_final_digdeeper = null
		}
		orderApp.getOrdersByDigdeeper(id_user, function(orders) {
			calendarApp.getEventsByDigdeeper(id_user, function (events) {

				for (var i = 0; i < orders.length; i++) {
					//var date_temp = new Date(orders[i].dataService.dateInit)
					//var di = date_temp.toISOString(0, 0, 0)
					//console.log(di)
					var fecha = {
						date_init: orders[i].dataService.dateInit,
						date_finish: orders[i].dataService.dateFinish,
						origin: 'pagina'
					}
					var ingresar = true
					for (var j = 0; j < dates.length; j++) {
						dates[j]
						if (String(dates[j].date_init) == String(fecha.date_init) && String(dates[j].date_finish) == String(fecha.date_finish)) {
							console.log("repetido")
							ingresar = false
							j = dates.length + 1
						}
					}
					if (ingresar) {
						dates.push(fecha)
					}
				}
				for (var i = 0; i < events.length; i++) {
					var fecha = {
						date_init: events[i].date,
						date_finish: events[i].date,
						origin: 'calendario'
					}
					var ingresar = true
					for (var j = 0; j < dates.length; j++) {
						if (String(fecha.date_init) == String(dates[j].date_init) && String(fecha.date_finish) == String(dates[j].date_finish)) {
							console.log("repetido")
							ingresar = false
							j = dates.length + 1
						}
					}
					if (ingresar) {
						dates.push(fecha)
					}
				}
			console.log("Fechas del Digdeeper*****************")
			console.log(dates)
			console.log("*************************************")
			async.eachOfSeries(dates, function (value, key, callback) {
				if (value != null) {
			    	var date_temp = new Date()
			    	var arrayHoursDefault = [   date_temp.toISOString(date_temp.setHours(0, 0, 0)),
					                             date_temp.toISOString(date_temp.setHours(0, 30, 0)),
					                             date_temp.toISOString(date_temp.setHours(1, 0, 0)),
					                             date_temp.toISOString(date_temp.setHours(1, 30, 0)),
					                             date_temp.toISOString(date_temp.setHours(2, 0, 0)),
					                             date_temp.toISOString(date_temp.setHours(2, 30, 0)),
					                             date_temp.toISOString(date_temp.setHours(3, 0, 0)),
					                             date_temp.toISOString(date_temp.setHours(3, 30, 0)),

					                             date_temp.toISOString(date_temp.setHours(4, 0, 0)),
					                             date_temp.toISOString(date_temp.setHours(4, 30, 0)),
					                             date_temp.toISOString(date_temp.setHours(5, 0, 0)),
					                             date_temp.toISOString(date_temp.setHours(5, 30, 0)),
					                             date_temp.toISOString(date_temp.setHours(6, 0, 0)),
					                             date_temp.toISOString(date_temp.setHours(6, 30, 0)),
					                             date_temp.toISOString(date_temp.setHours(7, 0, 0)),
					                             date_temp.toISOString(date_temp.setHours(7, 30, 0)),

					                             date_temp.toISOString(date_temp.setHours(8, 0, 0)),
					                             date_temp.toISOString(date_temp.setHours(8, 30, 0)),
					                             date_temp.toISOString(date_temp.setHours(9, 0, 0)),
					                             date_temp.toISOString(date_temp.setHours(9, 30, 0)),
					                             date_temp.toISOString(date_temp.setHours(10, 0, 0)),
					                             date_temp.toISOString(date_temp.setHours(10, 30, 0)),
					                             date_temp.toISOString(date_temp.setHours(11, 0, 0)),
					                             date_temp.toISOString(date_temp.setHours(11, 30, 0)),

					                             date_temp.toISOString(date_temp.setHours(12, 0, 0)),
					                             date_temp.toISOString(date_temp.setHours(12, 30, 0)),
					                             date_temp.toISOString(date_temp.setHours(13, 0, 0)),
					                             date_temp.toISOString(date_temp.setHours(13, 30, 0)),
					                             date_temp.toISOString(date_temp.setHours(14, 0, 0)),
					                             date_temp.toISOString(date_temp.setHours(14, 30, 0)),
					                             date_temp.toISOString(date_temp.setHours(15, 0, 0)),
					                             date_temp.toISOString(date_temp.setHours(15, 30, 0)),


					                             date_temp.toISOString(date_temp.setHours(16, 0, 0)),
					                             date_temp.toISOString(date_temp.setHours(16, 30, 0)),
					                             date_temp.toISOString(date_temp.setHours(17, 0, 0)),
					                             date_temp.toISOString(date_temp.setHours(17, 30, 0)),
					                             date_temp.toISOString(date_temp.setHours(18, 0, 0)),
					                             date_temp.toISOString(date_temp.setHours(18, 30, 0)),
					                             date_temp.toISOString(date_temp.setHours(19, 0, 0)),
					                             date_temp.toISOString(date_temp.setHours(19, 30, 0)),

					                             date_temp.toISOString(date_temp.setHours(20, 0, 0)),
					                             date_temp.toISOString(date_temp.setHours(20, 30, 0)),
					                             date_temp.toISOString(date_temp.setHours(21, 0, 0)),
					                             date_temp.toISOString(date_temp.setHours(21, 30, 0)),
					                             date_temp.toISOString(date_temp.setHours(22, 0, 0)),
					                             date_temp.toISOString(date_temp.setHours(22, 30, 0)),
					                             date_temp.toISOString(date_temp.setHours(23, 0, 0)),
					                             date_temp.toISOString(date_temp.setHours(23, 30, 0))]
			    	if (fecha_inicial_digdeeper != null && fecha_final_digdeeper != null) {
			    	 	var horarios_dia = reloadHours(fecha_inicial_digdeeper,fecha_final_digdeeper, arrayHoursDefault, date_temp)
			    		console.log("Rango de horarios del proveedor *************************"+horarios_dia)
						console.log(horarios_dia.length)
						console.log("*****************************************")
						arrayHoursDefault = horarios_dia
			    	}
			    	var dateDefaultInit = new Date(value.date_init)
			    	var dateDefaultFinish = new Date(value.date_finish)
			    	var horario = {
	                	date_init: dateDefaultInit,
	                	date_finish: dateDefaultFinish,
	                	horarios: []
	                }

	                var fecha = new Date(value.date_init);
				    dateDefaultInit2 = new Date(value.date_init);
				    dia = fecha.getDate();
				    mes = fecha.getMonth()+1;// +1 porque los meses empiezan en 0
				    anio = fecha.getFullYear();
				    dateDefaultInit2.setDate(dia);

				    var fecha = new Date(value.date_finish);
				    dateDefaultFinish2 = new Date(value.date_finish);
				    dia2 = fecha.getDate();
				    mes = fecha.getMonth()+1;// +1 porque los meses empiezan en 0
				    anio = fecha.getFullYear();
				    dateDefaultFinish2.setDate(dia2);

			    	// Ejecutar tareas
					let tasks = {
						FechasServiciosDentro: function (callback) {
							var array_horarios = []
							orderApp.getForRangeDateByDigdeeper(id_user, dateDefaultInit, dateDefaultFinish, function(orders) {
								calendarApp.getTimesForRangeDateByDigdeeper(id_user, dateDefaultInit2, dateDefaultFinish2, function (events) {
									console.log("events *************************"+events)
									console.log(events.length)
									console.log("*****************************************")
									for (var i = 0; i < orders.length; i++) {
										var orderdate = {
											dateInit: orders[i].dataService.dateInit,
											dateFinish: orders[i].dataService.dateFinish,
											hourInit: orders[i].dataService.hourInit,
											hourFinish: orders[i].dataService.hourFinish
										}
										array_horarios.push(orderdate)
									}
									for (var i = 0; i < events.length; i++) {
										var orderdate = {
											dateInit: events[i].date,
											dateFinish: events[i].date,
											hourInit: events[i].hourInit,
											hourFinish: events[i].hourFinal
										}
										array_horarios.push(orderdate)
									}
									console.log("Ordenes del Digdeeper segun la fecha "+dateDefaultInit +", "+dateDefaultFinish)
									console.log(array_horarios)
									console.log("*************************************")
									var ordersDates = []
									var fechas = []
									////////
									async.eachOfSeries(array_horarios, function (value, key, callback) {
									    if (value != null) {
											var orderdate = {
												dateInit: value.dateInit,
												dateFinish: value.dateFinish,
												hourInit: value.hourInit,
												hourFinish: value.hourFinish
											}
											//ordersDates.push(orderdate)
											var hourTemp_init = new Date(orderdate.hourInit)
			                				var hourTemp_finish = new Date(orderdate.hourFinish)
											var timeTemp = {
							                    init: date_temp.toISOString(date_temp.setHours(hourTemp_init.getHours(), hourTemp_init.getMinutes(), 0)),
							                    finish: date_temp.toISOString(date_temp.setHours(hourTemp_finish.getHours(), hourTemp_finish.getMinutes(), 0))
							                }
							                //console.log(timeTemp)

										    //console.log(arrayHoursDefault)
										    //console.log(arrayHoursDefault.length)
							                //var horarios_dia = reloadHours(timeTemp.init,timeTemp.finish, arrayHoursDefault)
							                var arrayClean = []
										    for (var i = 0; i < arrayHoursDefault.length; i++) {
										        if((arrayHoursDefault[i] >= timeTemp.init && arrayHoursDefault[i] <= timeTemp.finish)){
										            
										        }else{
										        	arrayClean.push(arrayHoursDefault[i])
										        }
										    }
										    //console.log(arrayClean)
							                /*var horario = {
							                	date_init: orderdate.dateInit,
							                	dates_finish: orderdate.dateFinish,
							                	horarios: arrayClean
							                }*/
							                horario.horarios = arrayClean
							                arrayHoursDefault = arrayClean
							                //fechas.push(horario)
							                console.log("Horarios disponibles de la fecha"+dateDefaultInit +", "+dateDefaultFinish)
											console.log(horario)
											console.log(horario.horarios.length)
											console.log("*************************************")
							                callback()
										}else{
											callback()
										}
									}, function (err) {
									    if (err) {
									        console.error(err.message);
									        callback()
									    }else{
									    	fechas.push(horario)
										   	//console.log(horario)
							                /*console.log("FECHAS CON HORARIOS DISPONIBLES******")
											console.log(fechas)
											console.log(fechas.length)
											console.log("*************************************")
											*/callback(null, fechas)
									    }
									});
								}, function (err) {
									callback(err, null)
								})
								//callback(null ,horario)
							}, function(err) {
								callback(err, null)
							})
						}
					}
					async.parallel(async.reflectAll(tasks), function(err, results) {
						if (err) {
							/*res.status(400)
							res.json({
								status: "failure",
								message: err
							})*/
							callback(err)
						}else{
							//console.log(results.FechasServiciosDentro.value)
							//var ordersFueraReult = results.FechasServiciosFuera.value.concat(results.FechasServiciosFuera.value)
							//var ordersReult = results.FechasServiciosDentro.value.concat(results.FechasServiciosFuera.value)
							//console.log(ordersReult)
							console.log("FECHAS CON HORARIOS DISPONIBLES DIGDEEP******")
							console.log(results.FechasServiciosDentro.value)
							console.log(results.FechasServiciosDentro.value.length)
							console.log("*************************************")
							fechas_result = fechas_result.concat(results.FechasServiciosDentro.value)
							/*res.status(201)
					 		res.json({
					 			status: "success",
					 			message: "Fechas encontradas correctamente",
					 			orders: ordersReult
					 		})*/
					 		console.log("FECHAS RESULT******")
							console.log(fechas_result)
							console.log("*************************************")
					 		callback()
						}
					});
				}else{
					callback()
				}
			}, function (err) {
			    if (err) {
			        console.error(err);
			        res.status(400)
					res.json({
						status: "failure",
						message: "No se ha´podido obtener las fechas."
					})
			    }else{
			    	if (fechas_result.length > 0) {
			    		//console.log("process finish***************"+fechas_result[0].horarios.length)
			    		//console.log("process finish***************"+fechas_result[1].horarios.length)
			    	}
			    	res.status(201)
			 		res.json({
			 			status: "success",
			 			message: "Fechas encontradas correctamente",
			 			orders_times: fechas_result
			 		})

			    }
			    
			});
			///
			},function (err) {
				res.status(400)
				res.json({
					status: "failure",
					message: "No se ha´podido obtener las fechas."
				})
			})
		}, function(err) {
			res.status(400)
			res.json({
				status: "failure",
				message: "No se ha´podido obtener las fechas."
			})
		})
	}, function (err) {
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
	//////////////777

	let tasks = {
			FechasServiciosDentro2: function (callback) {
				orderApp.getForRangeDateByDigdeeper(id_user, dateDefaultInit, dateDefaultFinish, function(orders) {
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
					callback(null ,ordersDates)
				}, function(err) {
					callback(err, null)
				})
			},
			FechasServiciosFuera2: function (callback) {
				var ordersDates = []
				
				fecha = new Date(dateDefaultInit);
			    entrega1 = new Date(dateDefaultInit);
			    dia = fecha.getDate();
			    mes = fecha.getMonth()+1;// +1 porque los meses empiezan en 0
			    anio = fecha.getFullYear();
			    entrega1.setDate(dia);

			    fecha = new Date(dateDefaultFinish);
			    entrega2 = new Date(dateDefaultFinish);
			    dia2 = fecha.getDate();
			    mes = fecha.getMonth()+1;// +1 porque los meses empiezan en 0
			    anio = fecha.getFullYear();
			    entrega2.setDate(dia2);
			    console.log("************Fechas a comparar************")
			    console.log(entrega1)
			    console.log(entrega2)
				calendarApp.getForRangeDateByDigdeeper(id_user, entrega1, entrega2, function (events) {
					for (var i = 0; i < events.length; i++) {
						var orderdate = {
							dateInit: events[i].date,
							dateFinish: events[i].date,
							hourInit: events[i].hourInit,
							hourFinish: events[i].hourFinal
						}
						ordersDates.push(orderdate)
					}
					callback(null, ordersDates)
				}, function (err) {
					callback(err, null)
				})
			}
		}
	async.parallel(async.reflectAll(tasks), function(err, results) {
		if (err) {
			res.status(400)
			res.json({
				status: "failure",
				message: err
			})
		}else{
			console.log(results.FechasServiciosFuera2.value)
			//var ordersFueraReult = results.FechasServiciosFuera2.value.concat(results.FechasServiciosFuera2.value)
			var ordersReult = results.FechasServiciosDentro2.value.concat(results.FechasServiciosFuera2.value)
			console.log(ordersReult)
			res.status(201)
	 		res.json({
	 			status: "success",
	 			message: "Fechas encontradas correctamente",
	 			orders: ordersReult
	 		})
		}
	});
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