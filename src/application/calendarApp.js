var calendarRepository      = require ("../domain/calendarRepository")

exports.create = function (data, onSuccess, onError){	
    calendarRepository.create(data, function(event) {
		onSuccess(event)
	}, onError)
}

exports.updateEvent = function (id, data, onSuccess, onError) {
    calendarRepository.find(id, function(event) {
        if (event != null) {
            calendarRepository.update(event, data, onSuccess, onError)
        }else{
            onError("No existe el evento")
        }
    }, onError)
}

exports.getEvent = function(id,onSuccess, onError) {
	calendarRepository.find(id,onSuccess, onError)
}

exports.getEvents = function(onSuccess, onError) {
	calendarRepository.findAll(onSuccess, onError)
}
exports.getEventsByDigdeeper = function(id, onSuccess, onError) {
	calendarRepository.findAllByDigdeeper(id, onSuccess, onError)
}

exports.deleteEvent = function(id, onSuccess, onError) {
	calendarRepository.find(id, function(event) {
		if (event != null) {
			calendarRepository.delete(event, onSuccess, onError)
		}
		else
			onError("No existe el evento")
	}, onError)
}
