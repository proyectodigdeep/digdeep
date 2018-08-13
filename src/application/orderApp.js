var orderRepository  = require ("../domain/orderRepository")
var async = require('async');
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
				onSuccess(order_finished)
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
			order.payDateService = new Date()
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
