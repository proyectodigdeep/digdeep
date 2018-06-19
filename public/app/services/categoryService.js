angular.module('digdeepApp.categoryService', ['angular-jwt'])

.service('categoryService', ['$http', 'jwtHelper',
function(                     $http,   jwtHelper) {

    this.getCategories = function (onSuccess, onError) {
        $http.get('v1/categories/').
        then(function (response) {
            if(response.data.status === "success"){
                onSuccess(response.data.categories)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }

    this.getCategory = function (id,onSuccess, onError) {
        $http.get('v1/categories/'+id).
        then(function (response) {
            if(response.data.status === "success"){
                onSuccess(response.data.category)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }

    this.getCategoryBySlug = function (id,onSuccess, onError) {
        $http.get('v1/categoriesbyslug/'+id).
        then(function (response) {
            if(response.data.status === "success"){
                onSuccess(response.data.category)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }

    this.getSubcategories = function (onSuccess, onError) {
        $http.get('v1/subcategories/').
        then(function (response) {
            if(response.data.status === "success"){
                onSuccess(response.data.subcategories)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }
}])
