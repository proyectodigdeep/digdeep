var orderRepository  = require ("../domain/orderRepository")

exports.create = function (data, onSuccess, onError){	
	orderRepository.create(data, function(order) {
		onSuccess(order)
	}, onError)
}
exports.update = function (order, onSuccess, onError){	
	orderRepository.update(order, function(order) {
		onSuccess(order)
	}, onError)
}
exports.getOrder = function(id,onSuccess, onError) {
    orderRepository.find(id,onSuccess, onError)
}

exports.getOrderByIdConkta = function(id,onSuccess, onError) {
    orderRepository.findByIdConekta(id,onSuccess, onError)
}
exports.getOrders = function(onSuccess, onError) {
    orderRepository.findAll(onSuccess, onError)
}
exports.getOrdersPending = function(onSuccess, onError) {
    orderRepository.findAllPending(onSuccess, onError)
}
exports.getOrdersInprocess = function(onSuccess, onError) {
    orderRepository.findAllInprocess(onSuccess, onError)
}
exports.getOrdersFinished = function(onSuccess, onError) {
    orderRepository.findAllFinished(onSuccess, onError)
}
exports.getOrdersCanceled = function(onSuccess, onError) {
    orderRepository.findAllCanceled(onSuccess, onError)
}
exports.getOrdersPay = function(onSuccess, onError) {
    orderRepository.findAllPay(onSuccess, onError)
}
exports.getOrdersByDigdeeper = function(id,onSuccess, onError) {
    orderRepository.findAllByDigdeeper(id,onSuccess, onError)
}
exports.getForRangeDateByDigdeeper = function(id, dateInit, dateFinal, onSuccess, onError) {
    orderRepository.getForRangeDateByDigdeeper(id, dateInit, dateFinal, onSuccess, onError)
}
exports.getOrdersByClient = function(id,onSuccess, onError) {
    orderRepository.findAllByClient(id,onSuccess, onError)
}
exports.confirmOrder = function (idOrder,data,onSuccess, onError) {
	orderRepository.find(idOrder,function (order) {
		if (order) {
			order.status = 2 // poner orden en proceso
			order.startDateService = data.startDateService
			orderRepository.update(order, function (order) {
				onSuccess(order)
			}, onError)
		}	
	},onError)
}
exports.finishOrder = function (idOrder,data,onSuccess, onError) {
	orderRepository.find(idOrder,function (order_finished) {
		if (order_finished) {
			order_finished.status = 3 // poner orden en finalizada
			order_finished.endDateService = data.endDateService
			orderRepository.update(order_finished, function (order_finished) {
				//onSuccess(order)
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
						onSuccess(order_finished)
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
							onSuccess(orderUpdated)
							/*res.status(201).json({
								status: "success",
								message: "orden generada correctamente por tarjeta",
								order: orderUpdated
							});*/
						}, function(err) {
							//onError(err)
							onSuccess(order)
							/*res.status(400).json({
								status: "failure",
								message: err
							});*/
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
							onSuccess(orderUpdated)
							/*res.status(201).json({
								status: "success",
								message: "orden generada correctamente por SPEI",
								order: orderUpdated
							});*/
						}, function(err) {
							onSuccess(order)
							/*onError(err)*/
							/*res.status(400).json({
								status: "failure",
								message: err
							});*/
						})
					}			
				});
				/////
			}, onError)
		}	
	},onError)
}
exports.cancelOrder = function (idOrder, data, onSuccess, onError) {
	orderRepository.find(idOrder,function (order) {
		if (order) {
			order.status = 4 // poner orden en cancelada
			order.endDateService = data.endDateOrder
			order.dataCancelOrder.cancelledBy = data.id_user
			order.dataCancelOrder.cancelReasons = data.cancelReasons
			orderRepository.update(order, function (order) {
				onSuccess(order)
			}, onError)
		}	
	},onError)
}
exports.payOrder = function (idOrder,data,onSuccess, onError) {
	orderRepository.find(idOrder,function (order) {
		if (order) {
			order.status = 6 // poner orden en procesando pago
			order.payDateService = data.payDateService
			order.idOrderConekta = data.idOrderConekta
			order.paymentMethod  = data.paymentMethod
			orderRepository.update(order, function (order) {
				onSuccess(order)
			}, onError)
		}	
	},onError)
}
exports.putStatusOrderPaid = function (idOrder,onSuccess, onError) {
	orderRepository.find(idOrder,function (order) {
		if (order) {
			order.status = 5 // poner orden en pagada
			orderRepository.update(order, function (order) {
				onSuccess(order)
			}, onError)
		}	
	},onError)
}
exports.qualifyOrder = function (data, onSuccess, onError) {
	orderRepository.find(data.id_order,function (order) {
		if (order) {
			// si orden pagada para poder calificarla
			if (order.status === 5) {
				if (order.value === -1) {
					order.value = data.value
					orderRepository.update(order, function (order) {
						onSuccess(order)
					}, onError)
				}else{
					onError("Ya has calificado este servicio antes")	
				}
			}else{
				onError("No es el momento para calificar inténtalo despues")
			}
		}	
	},onError)
}
