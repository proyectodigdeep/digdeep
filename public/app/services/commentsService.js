angular.module('digdeepApp.commentsService', ['angular-jwt'])

.service('commentsService', ['$http', 'jwtHelper',
function(                     $http,   jwtHelper) {

    this.createComment = function (commentData, onSuccess, onError){
        $http.post('v1/comments/', commentData)
        .then(function(response) {
            if(response.data.status === "success"){
                onSuccess(response.data.comment)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }

     this.getComment = function (id,onSuccess, onError) {
        $http.get('v1/comments/'+id).
        then(function (response) {
            if(response.data.status === "success"){
                onSuccess(response.data.comment)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }

    this.getComments = function (onSuccess, onError) {
        $http.get('v1/comments/').
        then(function (response) {
            if(response.data.status === "success"){
                onSuccess(response.data.comments)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }

}])
