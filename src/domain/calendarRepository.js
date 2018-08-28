var calendarEntity = require("./calendarEntity")

exports.create = function (data, onSuccess, onError){
	var calendar = new calendarEntity()
		calendar.title = data.title
		calendar.hourInit = data.hourInit
		calendar.hourFinal = data.hourFinal
		calendar.date = data.date
		calendar._digdeeper = data.digdeeper

	calendar.save(function(err,calendar){
		if(err) return onError(err)
		else return onSuccess(calendar)
	})
}

exports.update = function(event, data, onSuccess, onError) {
	event.title = (data.title != null) ? data.title : event.title
	event.date = (data.date != null) ? data.date : event.date
	event.hourInit = (data.hourInit != null) ? data.hourInit: event.hourInit
	event.hourFinal = (data.hourFinal != null) ? data.hourFinal: event.hourFinal
	
	event.save(function (err,event){
		if(err) return onError(err)
		else return onSuccess(event)
	})
}

exports.find = function(id, onSuccess, onError) {
	calendarEntity.findOne({"_id": id}).exec(function(err, event) {
		if (err) return onError("Hubo un error al obtener un evento del calendario: "+ err)
		else return onSuccess(event)
	})
}

exports.findAll = function(onSuccess, onError) {
	calendarEntity.find({}).exec(function(err, events) {
		if (err) return onError("Hubo un error al obtener todas los eventos del calendario: "+ err)
		else return onSuccess(events)
	})
}
exports.getForRangeDateByDigdeeper = function(id, dateInit, dateFinish, onSuccess, onError) {
	calendarEntity.find({ $and: [{"_digdeeper": id}, {'date': {$eq: dateInit}}]}).exec(function(err, events) {
	
	//calendarEntity.find({ $and: [{"_digdeeper": id}, {'date': {$gt: dateInit }} , {'date': {$lt: dateFinish}} ]}).exec(function(err, events) {
		//console.log(events)
		if (err) return onError("Hubo un error al obtener todas los eventos: "+ err)
		else return onSuccess(events)
	})
}
exports.findAllByDigdeeper = function(id, onSuccess, onError) {
	calendarEntity.find({"_digdeeper": id}).exec(function(err, events) {
		if (err) return onError("Hubo un error al obtener todos los eventos: "+ err)
		else return onSuccess(events)
	})
}

exports.delete = function(event, onSuccess, onError) {
	event.remove(function(err) {
		if (err) return onError("Hubo un error al borrar el evento "+event._id+": "+err)
		else return onSuccess()
	})

}