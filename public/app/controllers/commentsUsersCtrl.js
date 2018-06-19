angular.module('digdeepApp.commentsUsersCtrl', [])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('commentsUsers', {
		url: '/commentsUsers',
		templateUrl: '/app/templates/commentsUsers.html',
		controller: 'commentsUsersCtrl'
	})
}])

.controller('commentsUsersCtrl', [ '$localStorage', '$scope', '$state', '$rootScope', '$interval', '$http', 'commentsService','ordersService',
function (                  	    $localStorage,   $scope,   $state,	 $rootScope,   $interval,   $http,   commentsService,  ordersService) {
	
   	// Obtener los datos del usuario para mostrar su perfil
	$rootScope.$emit('reloadUser',{done: function() {
	}})
    // Verificar el tipo de usuario para mostrar la barra de navegación acorde a el
    $rootScope.$emit('checkRollUser',{done: function() {
    }})
    $scope.typeUser = $rootScope.typeUser
    $scope.numComments = 0
    $scope.cad = ""
    $scope.comments = []
    $scope.limitPage = 6
    $scope.finalIndex = 0
    $scope.initIndex = 0

    if ($localStorage.token == undefined) {
        $state.go("home")
    }else{
        commentsService.getComments(function (comments) {
            $scope.comments    = comments
            $scope.numComments = comments.length
            $scope.initIndex   = 0 * $scope.limitPage
            $scope.finalIndex  = $scope.limitPage
        },function (err) {
            console.log("Error al obtener los comentarios")
        })
    }

    $scope.pageChanged = function (currentPage) {
        $scope.initIndex    = (currentPage-1) * $scope.limitPage
        $scope.finalIndex   = ($scope.limitPage) * (currentPage)
    }
}])
