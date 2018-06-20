angular.module('digdeepApp.calendarService', ['angular-jwt'])

.service('calendarService', ['$http', 'jwtHelper',
function(                     $http,   jwtHelper) {

    this.createEvent = function (event, token, onSuccess, onError){
        $http.post('v1/events/', event,
        {headers: {"x-access-token": token}})
        .then(function(response) {
            if(response.data.status === "success"){
                onSuccess(response.data.event)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }

    this.updateEvent = function (id, event, token, onSuccess, onError){
        $http.put('v1/events/'+id, event,
        {headers: {"x-access-token": token}})
        .then(function(response) {
            if(response.data.status === "success"){
                onSuccess(response.data.event)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }

    this.deleteEvent = function (id, token, onSuccess, onError){
        $http.delete('v1/events/'+id,
        {headers: {"x-access-token": token}})
        .then(function(response) {
            if(response.data.status === "success"){
                onSuccess(response.data.event)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }

    this.getEvents = function (token, onSuccess, onError) {
        $http.get('v1/events/',
        {headers: {"x-access-token": token}}).
        then(function (response) {
            if(response.data.status === "success"){
                console.log(response.data)
                onSuccess(response.data.events)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }

    this.getEventsByDigdeeper = function (id, token, onSuccess, onError) {
        $http.get('v1/events_by_digdeeper/'+id).
        then(function (response) {
            if(response.data.status === "success"){
                console.log(response.data)
                onSuccess(response.data.events)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }

    this.getEvent = function (id, token, onSuccess, onError) {
        $http.get('v1/events/'+id,
        {headers: {"x-access-token": token}}).
        then(function (response) {
            if(response.data.status === "success"){
                onSuccess(response.data.event)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }
}])
