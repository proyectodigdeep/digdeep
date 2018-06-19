angular.module('digdeepApp.serviceService', ['angular-jwt'])

.service('serviceService', ['$http', 'jwtHelper',
function(                    $http,   jwtHelper) {

    this.createService = function (serviceData, onSuccess, onError){
        $http.post('v1/services/', serviceData)
        .then(function(response) {
            if(response.data.status === "success"){
                onSuccess(response.data.service)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }

     this.getService = function (id,onSuccess, onError) {
        $http.get('v1/services/'+id).
        then(function (response) {
            if(response.data.status === "success"){
                onSuccess(response.data.service)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }

    this.getServices = function (onSuccess, onError) {
        $http.get('v1/services/').
        then(function (response) {
            if(response.data.status === "success"){
                onSuccess(response.data.services)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }
    
    // Obtener los servicios creados por un digdeeper
    this.getServicesOfUser = function (id, onSuccess, onError) {
        $http.get('v1/servicesbydigdeeper/'+id).
        then(function (response) {
            if(response.data.status === "success"){
                //console.log(response.data)
                onSuccess(response.data.services)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }
    // Obtener los servicios creados por un digdeeper
    this.getServicesByDigdeeperComments = function (id, onSuccess, onError) {
        $http.get('v1/servicesbydigdeepercomments/'+id).
        then(function (response) {
            if(response.data.status === "success"){
                onSuccess(response.data.services)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }

    this.deleteService = function (id,onSuccess, onError) {
        $http.delete('v1/services'+id)
        .then(function (response) {
            if(response.data.status === "success"){
                //onSuccess(response.data.order)
                onSuccess(response.data.status)
            }
            else{
                onError(response.data.message)
            }
        },onError)
    }

    this.updateService = function (idService,service,token,onSucces, onError) {
        var data = {
            title: service.title,
            pictures: service.pictures,
            _category: service.category,
            _subcategory: service.subcategory,
            description: service.description,
            filters: service.filters,
            price_athome: service.price_athome,
            price_presencial: service.price_presencial
        }
        $http.put('v1/services/'+idService,data,
        {headers: {'x-access-token': token}})
        .then(function(response) {
            if(response.data.status === "success"){
                onSucces(response.data.service)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }
    this.addComment = function (idService,comment,token,onSucces, onError) {
        var data = {
            comment: comment
        }
        console.log(data.comment)
        $http.put('v1/addcommentservice/'+idService,data,
        {headers: {'x-access-token': token}})
        .then(function(response) {
            if(response.data.status === "success"){
                onSucces(response.data.service)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }

}])
