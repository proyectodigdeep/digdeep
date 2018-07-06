var orderEntity = require("./orderEntity")

exports.create = function (data, onSuccess, onError){
	//console.log(data)
	var order = new orderEntity()
		order.client 		= data.client
		order.digdeeper 	= data.digdeeper
		order.notes 		= data.notes
		order.cancelledBy 	= data.cancelledBy
		order.status 		= 1//orden en status pendiente por default
		order.requestedDate 	= data.requestedDate
		order.startDateService 	= data.startDateService
		order.endDateService 	= data.endDateService
		order.value 			= data.value 
		order.placeService 		= data.placeService

		order.dataDelivery.name 	= data.deliveryData.name	
		order.dataDelivery.email 	= data.deliveryData.email
		order.dataDelivery.phone 	= data.deliveryData.phone
		order.dataDelivery.address 	= data.deliveryData.address
		

		order.dataBilling.name 	= data.dataBilling.name
		order.dataBilling.rfc 	= data.dataBilling.rfc
		order.dataBilling.phone = data.dataBilling.phone
		order.dataBilling.cp 	= data.dataBilling.cp

		order.dataService.dateInit  	= data.dateInit
		order.dataService.dateFinish 	= data.dateFinal
		order.dataService.hourInit 		= data.hourInit
		order.dataService.hourFinish 	= data.hourFinal
		order.dataService.paymentMethod	= data.metodPay
		order.dataService.cost 			= data.total
		order.dataService._service 		= data.service
		order.dataService.title 		= data.title
		order.dataService.picture 		= data.picture
		order.dataService.nameDD 		= data.nameDD
		order.dataService.imgDD 		= data.imgDD
		order.dataService.nameUser 		= data.nameUser
		order.dataService.imgUser 		= data.imgUser
		order.dataService.coordinates.lat 	= data.coordinates.lat
		order.dataService.coordinates.lng 	= data.coordinates.lng

		order.idOrderConekta 			= ""
		order.idMethodPay 				= data.idMethodPay
		
	order.save(function(err,order){
		if(err) return onError(err)
		else return onSuccess(order)
	})
}

exports.findAll = function(onSuccess, onError) {
	orderEntity.find({}).exec(function(err, orders) {
		if (err) return onError("Hubo un error al obtener todas las ordenes: "+ err)
		else return onSuccess(orders)
	})
}
exports.findAllPending = function(onSuccess, onError) {
	orderEntity.find({"status": 1}).exec(function(err, orders) {
		if (err) return onError("Hubo un error al obtener todas las ordenes: "+ err)
		else return onSuccess(orders)
	})
}
exports.findAllInprocess = function(onSuccess, onError) {
	orderEntity.find({"status": 2}).exec(function(err, orders) {
		if (err) return onError("Hubo un error al obtener todas las ordenes: "+ err)
		else return onSuccess(orders)
	})
}
exports.findAllFinished = function(onSuccess, onError) {
	orderEntity.find({"status": 3}).exec(function(err, orders) {
		if (err) return onError("Hubo un error al obtener todas las ordenes: "+ err)
		else return onSuccess(orders)
	})
}
exports.findAllCanceled = function(onSuccess, onError) {
	orderEntity.find({"status": 4}).exec(function(err, orders) {
		if (err) return onError("Hubo un error al obtener todas las ordenes: "+ err)
		else return onSuccess(orders)
	})
}
exports.findAllPay = function(onSuccess, onError) {
	orderEntity.find({"status": 5}).exec(function(err, orders) {
		if (err) return onError("Hubo un error al obtener todas las ordenes: "+ err)
		else return onSuccess(orders)
	})
}
exports.findAllByDigdeeper = function(id,onSuccess, onError) {
	orderEntity.find({"digdeeper": id}).exec(function(err, orders) {
		if (err) return onError("Hubo un error al obtener todas las ordenes: "+ err)
		else return onSuccess(orders)
	})
}
exports.getForRangeDateByDigdeeper = function(id, dateInit, dateFinish, onSuccess, onError) {
	orderEntity.find({ $and: [{"digdeeper": id}, {'dataService.dateInit': {$gte: dateInit}}, {'dataService.dateFinish': {$lte: dateFinish}} ]}).exec(function(err, orders) {
		if (err) return onError("Hubo un error al obtener todas las ordenes: "+ err)
		else return onSuccess(orders)
	})
}
exports.findAllByClient = function(id,onSuccess, onError) {
	orderEntity.find({"client": id}).exec(function(err, orders) {
		if (err) return onError("Hubo un error al obtener todas las ordenes: "+ err)
		else return onSuccess(orders)
	})
}

exports.find = function (id, onSuccess, onError) {
	orderEntity.findOne({"_id": id}, function (err, order){
		if (err)
			onError(err)
		else
			onSuccess(order)
	})
}
exports.findByIdConekta = function (id, onSuccess, onError) {
	orderEntity.findOne({"idOrderConekta" : id }, function (err, order){
		if (err)
			onError(err)
		else
			onSuccess(order)
	})
}
exports.update = function(order, onSuccess, onError) {
	order.save(function (err,order){
		if(err) return onError(err)
		else return onSuccess(order)
	})
}
