angular.module('digdeepApp.termsCtrl', [])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('terms', {
		url: '/terms',
		templateUrl: '/app/templates/terms.html',
		controller: 'termsCtrl'
	})
}])

.controller('termsCtrl', [ '$scope', '$state', '$rootScope', '$interval',
function (                 	$scope,   $state,   $rootScope,   $interval) {
	
}])