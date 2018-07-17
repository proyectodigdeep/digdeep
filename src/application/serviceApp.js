var serviceRepository       = require ("../domain/serviceRepository")
var categoryRepository      = require("../domain/categoryRepository")
var subcategoryRepository   = require("../domain/subcategoryRepository")
var commentRepository       = require("../domain/commentRepository")

exports.create = function (data, onSuccess, onError){
    categoryRepository.find(data.category,function (category) {
        if (category != null) {
            subcategoryRepository.find(data.subcategory,function (subcategory) {
                if (subcategory != null) {
                    data.category    = category
                    data.subcategory = subcategory
                    serviceRepository.create(data, function(service) {
                        onSuccess(service)
                    }, onError)
                }else{
                    onError("No existe la subcategoria")
                }
            }, onError)
        }
        else
            onError("No existe la categoría")
    }, onError) 
}
exports.getService = function(id,onSuccess, onError) {
	serviceRepository.find(id,onSuccess, onError)
}

exports.getServices = function(onSuccess, onError) {
    serviceRepository.findAll(onSuccess, onError)
}
exports.getServicesByDigdeeper = function(id,onSuccess, onError) {
    serviceRepository.findAllByDigdeeper(id,function (services) {
        onSuccess(services)
    }, onError)
}
exports.updateService = function (id, data, onSuccess, onError) {
    serviceRepository.find(id, function(service) {
        if (service != null) {
            serviceRepository.update(service, data, onSuccess, onError)   
        }else{
            onError("No existe el servicio")
        }
    }, onError)
}
exports.deleteService = function(id, onSuccess, onError) {
    serviceRepository.find(id, function(service) {
        if (service != null) {
            serviceRepository.delete(service, onSuccess, onError)
        }
        else
            onError("No existe el servicio")
    }, onError)
}