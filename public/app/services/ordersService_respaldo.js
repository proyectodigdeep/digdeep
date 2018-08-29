angular.module('digdeepApp.ordersService', ['angular-jwt'])

.service('ordersService', ['$http', 'jwtHelper',
function(                  $http,   jwtHelper) {

    // Crear y publicar una orden realizada por un usuario con rol "user"
	this.postOrder = function (orderData, token, onSucces, onError) {
		$http.post('v1/orders/', orderData,
        {headers: {'x-access-token': token}})
        .then(function(response) {
            if(response.data.status === "success"){
                //onSuccess(response.data.order)
                onSucces(response.data.order)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
	}
    this.getDatesByDigdeeper = function (idDigdeeper, onSucces, onError) {
        $http.get('v1/datesbydigdeeper/'+idDigdeeper)
        .then(function (response) {
            if(response.data.status === "success"){
                onSucces(response.data.dates, response.data.ordersDates)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }
    this.getDatesAndHoursByRangeDate = function (idDigdeeper, dateDefaultInit, dateDefaultFinish, onSucces, onError) {
        var data = {}
            data.dateDefaultInit = dateDefaultInit
            data.dateDefaultFinish = dateDefaultFinish  
        
        $http.post('v1/getordersforRangedatebydigdeeper/'+idDigdeeper, data)
        .then(function (response) {
            if(response.data.status === "success"){
                onSucces(response.data.orders)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }
    // Calificar un servicio
    this.qualifyService = function (id_order, value, token, onSucces, onError) {
        var data = {
            id_order : id_order,
            value: value
        }
        $http.post('v1/qualifyservice/', data,
        {headers: {'x-access-token': token}})
        .then(function(response) {
            if(response.data.status === "success"){
                onSucces(response.data.order)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }
    // Confirmar una orden 
    this.confirmOrder = function (id_order,startDateService,token, onSucces, onError) {
        var data = {
            id_order : id_order,
            startDateService: startDateService
        }
        $http.post('v1/confirmorders/', data,
        {headers: {'x-access-token': token}})
        .then(function(response) {
            if(response.data.status === "success"){
                onSucces(response.data.order)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }
    // Confirmar una orden 
    this.cancelOrder = function (id_order,dataCancel,token, onSucces, onError) {
        var data = {
            id_order : id_order,
            id_user  : dataCancel.id_user,
            cancelReasons: dataCancel.cancellationReasons,
            endDateOrder: dataCancel.endDateOrder
        }
        $http.post('v1/cancelorders/', data,
        {headers: {'x-access-token': token}})
        .then(function(response) {
            if(response.data.status === "success"){
                onSucces(response.data.order)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }
    // Finalizar una orden
    this.finishOrder = function (id_order,endDateService,token, onSucces, onError) {
        var data = {
            id_order : id_order,
            endDateService: endDateService
        }
        $http.post('v1/finishorders/', data,
        {headers: {'x-access-token': token}})
        .then(function(response) {
            if(response.data.status === "success"){
                onSucces(response.data.order)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }
    // Finalizar una orden
    this.payOrder = function (id_order, payDateService, tokenCard, paymentMethod, token, onSucces, onError) {
        var data = {
            id_order : id_order,
            payDateService: payDateService,
            tokenCard: tokenCard,
            paymentMethod: paymentMethod
        }
        $http.post('v1/payorders/', data,
        {headers: {'x-access-token': token}})
        .then(function(response) {
            if(response.data.status === "success"){
                onSucces(response.data.order)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }
    // Obtener las ordenes de un usuario con rol "user"
    this.getOrdersClient = function (id,token,onSuccess, onError) {
        $http.get('v1/ordersbyclient/'+id,
        {headers: {'x-access-token': token}})
        .then(function (response) {
            if(response.data.status === "success"){
                onSuccess(response.data.orders)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }
    
    // Obtener ordenes de un usuario con rol "digdeeper"
    this.getOrdersDigdeeper = function (id,token, onSucces, onError) {
        $http.get('v1/ordersbydigdeeper/'+id,
        {headers: {'x-access-token': token}})
        .then(function (response) {
            if(response.data.status === "success"){
                onSucces(response.data.orders)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }
    // Obtener todas las ordenes
    this.getOrders = function (token, onSucces, onError) {
        $http.get('v1/orders/',
        {headers: {'x-access-token': token}})
        .then(function (response) {
            if(response.data.status === "success"){
                onSucces(response.data.orders)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }
    // Obtener todas las ordenes Pendientes
    this.getOrdersPending = function (token, onSucces, onError) {
        $http.get('v1/orderspending/',
        {headers: {'x-access-token': token}})
        .then(function (response) {
            if(response.data.status === "success"){
                onSucces(response.data.orders)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }
    // Obtener todas las ordenes En proceso
    this.getOrdersInprocess = function (token, onSucces, onError) {
        $http.get('v1/ordersinprocess/',
        {headers: {'x-access-token': token}})
        .then(function (response) {
            if(response.data.status === "success"){
                onSucces(response.data.orders)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }
    // Obtener todas las ordenes finalizadas
    this.getOrdersFinished = function (token, onSucces, onError) {
        $http.get('v1/ordersfinished/',
        {headers: {'x-access-token': token}})
        .then(function (response) {
            if(response.data.status === "success"){
                onSucces(response.data.orders)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }
    // Obtener todas las ordenes canceladas
    this.getOrdersCanceled = function (token, onSucces, onError) {
        $http.get('v1/orderscanceled/',
        {headers: {'x-access-token': token}})
        .then(function (response) {
            if(response.data.status === "success"){
                onSucces(response.data.orders)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }
    // Obtener todas las ordenes pagadas
    this.getOrdersPay = function (token, onSucces, onError) {
        $http.get('v1/orderspay/',
        {headers: {'x-access-token': token}})
        .then(function (response) {
            if(response.data.status === "success"){
                onSucces(response.data.orders)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }

    this.getOrder = function (id,token, onSucces, onError) {
        console.log(id)
        $http.get('v1/orders/'+String(id),
        {headers: {'x-access-token': token}})
        .then(function (response) {
            if(response.data.status === "success"){
                //onSuccess(response.data.order)
                onSucces(response.data.order)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }
}])
