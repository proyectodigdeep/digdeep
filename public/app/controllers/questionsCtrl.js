angular.module('digdeepApp.questionsCtrl', [])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('questions', {
		url: '/questions',
		templateUrl: '/app/templates/questions.html',
		controller: 'questionsCtrl'
	})
}])

.controller('questionsCtrl', [ '$scope', '$state', '$rootScope', '$interval',
function (                 	$scope,   $state,   $rootScope,   $interval) {
	
}])